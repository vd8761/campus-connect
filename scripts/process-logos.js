const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const universityDir = path.join(__dirname, '..', 'public', 'university');
const backupDir = path.join(__dirname, '..', 'public', 'university-original');

async function run() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    const originalFiles = fs.readdirSync(universityDir).filter(f => f.endsWith('.webp'));
    for (const file of originalFiles) {
      fs.copyFileSync(path.join(universityDir, file), path.join(backupDir, file));
    }
    console.log(`Backed up ${originalFiles.length} original files to ${backupDir}`);
  }

  const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.webp'));
  console.log(`Processing ${files.length} logos...`);

  const results = [];

  for (const file of files) {
    const inputPath = path.join(backupDir, file);
    const outputPath = path.join(universityDir, file);

    // 1. Trim excess margins (handles both white border and alpha border)
    const img = sharp(inputPath);
    const trimmedBuffer = await img.trim().toBuffer();
    const trimmedMeta = await sharp(trimmedBuffer).metadata();

    // 2. Optical sizing calculation
    // Target uniform canvas dimensions
    const canvasWidth = 480;
    const canvasHeight = 220;

    // Optical bounds inside canvas
    // Wide logos will utilize more width, square logos are bounded by height
    const maxBoxW = 380;
    const maxBoxH = 130;

    const aspect = trimmedMeta.width / trimmedMeta.height;

    // For square-ish logos (aspect < 1.3), cap height slightly lower (e.g. 110px) to prevent them looking overpowering
    let boxH = maxBoxH;
    let boxW = maxBoxW;
    if (aspect < 1.4) {
      boxH = 105;
      boxW = 105 * aspect;
    }

    const resizedBuffer = await sharp(trimmedBuffer)
      .resize({
        width: Math.round(boxW),
        height: Math.round(boxH),
        fit: 'inside',
        withoutEnlargement: false
      })
      .toBuffer();

    const resizedMeta = await sharp(resizedBuffer).metadata();

    // 3. Composite onto a standardized canvas
    // Transparent canvas so it works gracefully on any light/white container
    await sharp({
      create: {
        width: canvasWidth,
        height: canvasHeight,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      }
    })
      .composite([{ input: resizedBuffer, gravity: 'centre' }])
      .webp({ quality: 92 })
      .toFile(outputPath);

    results.push({
      file,
      trimmed: `${trimmedMeta.width}x${trimmedMeta.height}`,
      finalInBox: `${resizedMeta.width}x${resizedMeta.height}`,
      aspect: aspect.toFixed(2)
    });
  }

  console.table(results);
  console.log('All logos standardized successfully!');
}

run().catch(err => {
  console.error('Error processing logos:', err);
  process.exit(1);
});
