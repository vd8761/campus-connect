const fs = require('fs');
const zlib = require('zlib');

function makeCrcTable() {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  return table;
}
const crcTable = makeCrcTable();

function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  buf.writeUInt32BE(crc32(typeAndData), 8 + len);
  return buf;
}

const inputPath = 'public/atom-logo.bak.png';
const outputPath = 'public/atom-logo.png';
const buf = fs.readFileSync(inputPath);

const w = buf.readUInt32BE(16);
const h = buf.readUInt32BE(20);
const pIdx = buf.indexOf(Buffer.from('PLTE')) + 4;

let idatChunks = [];
let idx = 8;
while (idx < buf.length) {
  const len = buf.readUInt32BE(idx);
  const type = buf.subarray(idx + 4, idx + 8).toString('ascii');
  if (type === 'IDAT') idatChunks.push(buf.subarray(idx + 8, idx + 8 + len));
  idx += 12 + len;
}
const uncompressed = zlib.inflateSync(Buffer.concat(idatChunks));

// Create RGBA scanlines: 1 filter byte (0) + w * 4 bytes per row
const rgbaScanlines = Buffer.alloc((1 + w * 4) * h);

for (let y = 0; y < h; y++) {
  const srcRow = y * (w + 1) + 1;
  const dstRow = y * (1 + w * 4);
  rgbaScanlines[dstRow] = 0; // Filter: None

  for (let x = 0; x < w; x++) {
    const paletteIndex = uncompressed[srcRow + x];
    const dstPixel = dstRow + 1 + x * 4;

    if (paletteIndex === 0) {
      // Already transparent outer margin
      rgbaScanlines[dstPixel] = 0;
      rgbaScanlines[dstPixel + 1] = 0;
      rgbaScanlines[dstPixel + 2] = 0;
      rgbaScanlines[dstPixel + 3] = 0;
      continue;
    }

    const r = buf[pIdx + paletteIndex * 3];
    const g = buf[pIdx + paletteIndex * 3 + 1];
    const b = buf[pIdx + paletteIndex * 3 + 2];

    // Check if pixel is background (near white)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    if (r >= 244 && g >= 244 && b >= 244) {
      // Completely transparent background
      rgbaScanlines[dstPixel] = r;
      rgbaScanlines[dstPixel + 1] = g;
      rgbaScanlines[dstPixel + 2] = b;
      rgbaScanlines[dstPixel + 3] = 0;
    } else if (brightness >= 225) {
      // Smooth anti-aliased edge
      const alphaFactor = (244 - brightness) / (244 - 225);
      const alpha = Math.min(255, Math.max(0, Math.round(alphaFactor * 255)));
      rgbaScanlines[dstPixel] = r;
      rgbaScanlines[dstPixel + 1] = g;
      rgbaScanlines[dstPixel + 2] = b;
      rgbaScanlines[dstPixel + 3] = alpha;
    } else {
      // Solid artwork (atom symbol & text)
      rgbaScanlines[dstPixel] = r;
      rgbaScanlines[dstPixel + 1] = g;
      rgbaScanlines[dstPixel + 2] = b;
      rgbaScanlines[dstPixel + 3] = 255;
    }
  }
}

// Compress RGBA data
const compressed = zlib.deflateSync(rgbaScanlines, { level: 9 });

// Build new PNG
const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(w, 0);
ihdr.writeUInt32BE(h, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // color type: RGBA
ihdr[10] = 0; // compression
ihdr[11] = 0; // filter
ihdr[12] = 0; // interlace

const chunks = [
  signature,
  makeChunk('IHDR', ihdr),
  makeChunk('IDAT', compressed),
  makeChunk('IEND', Buffer.alloc(0))
];

fs.writeFileSync(outputPath, Buffer.concat(chunks));
console.log('Successfully created true RGBA transparent atom-logo.png!');
console.log('New file size:', fs.statSync(outputPath).size);
