const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const universityDir = path.join(__dirname, '..', 'public', 'university');
const files = fs.readdirSync(universityDir).filter(f => f.endsWith('.webp'));

async function reprocess() {
  console.log(`Reprocessing ${files.length} logos with Optical Volume Balancing...`);

  // Target standard canvas: 400x120
  const canvasW = 400;
  const canvasH = 120;

  for (const file of files) {
    const filePath = path.join(universityDir, file);
    const fileBuf = fs.readFileSync(filePath);

    // 1. Trim all blank/transparent borders
    const trimmedBuf = await sharp(fileBuf).trim().toBuffer({ resolveWithObject: true });
    const tw = trimmedBuf.info.width;
    const th = trimmedBuf.info.height;
    const aspect = tw / th;

    // 2. Optical target sizing
    let targetW, targetH;
    if (aspect >= 5.0) {
      targetW = 340;
      targetH = Math.round(340 / aspect);
    } else if (aspect >= 3.4) {
      targetH = 58;
      targetW = Math.round(58 * aspect);
    } else if (aspect >= 2.2) {
      targetH = 64;
      targetW = Math.round(64 * aspect);
    } else if (aspect >= 1.5) {
      targetH = 70;
      targetW = Math.round(70 * aspect);
    } else {
      targetH = 72;
      targetW = Math.round(72 * aspect);
    }

    // Safety checks against canvas bounds
    if (targetW > canvasW - 20) {
      targetW = canvasW - 20;
      targetH = Math.round(targetW / aspect);
    }
    if (targetH > canvasH - 16) {
      targetH = canvasH - 16;
      targetW = Math.round(targetH * aspect);
    }

    // Resize trimmed image to optical target
    const resizedBuf = await sharp(trimmedBuf.data)
      .resize(targetW, targetH, {
        fit: 'contain',
        withoutEnlargement: false,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toBuffer();

    // Composite onto transparent canvas
    const finalBuf = await sharp({
      create: {
        width: canvasW,
        height: canvasH,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      }
    })
      .composite([{ input: resizedBuf, gravity: 'centre' }])
      .webp({ quality: 95 })
      .toBuffer();

    fs.writeFileSync(filePath, finalBuf);
    console.log(`Processed ${file}: aspect=${aspect.toFixed(2)} -> ${targetW}x${targetH} in ${canvasW}x${canvasH}`);
  }

  console.log('All 19 logos reprocessed with optimal optical balance!');
}

reprocess().catch(err => {
  console.error(err);
  process.exit(1);
});
