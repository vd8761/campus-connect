const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const universityDir = path.join(__dirname, '..', 'public', 'university');
const brainDir = 'C:/Users/HP/.gemini/antigravity-ide/brain/4c7a3a1b-7307-495e-a8b5-f5f7167a6848';
const downloadsDir = 'C:/Users/HP/Downloads/University Logo';

const canvasW = 400;
const canvasH = 120;

async function updateAll() {
  console.log('--- Updating Requested Logos ---');

  // 1. Amity University (from official transparent logo)
  const amityPath = path.join(brainDir, 'amity_official.png');
  const amityBuf = fs.readFileSync(amityPath);
  const amityTrimmed = await sharp(amityBuf).trim().toBuffer({ resolveWithObject: true });
  const amityAspect = amityTrimmed.info.width / amityTrimmed.info.height;
  const amityH = 62;
  const amityW = Math.round(amityH * amityAspect);
  const amityResized = await sharp(amityTrimmed.data)
    .resize(amityW, amityH, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();
  const amityFinal = await sharp({
    create: { width: canvasW, height: canvasH, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 0 } }
  })
    .composite([{ input: amityResized, gravity: 'centre' }])
    .webp({ quality: 95 })
    .toBuffer();
  fs.writeFileSync(path.join(universityDir, '7. Amity University.webp'), amityFinal);
  console.log(`Updated 7. Amity University.webp: ${amityW}x${amityH} in ${canvasW}x${canvasH}`);

  // 2. Shiv Nadar University Chennai (from downloaded 2K SNU image)
  const snuPath = path.join(brainDir, 'snu_downloaded.jpg');
  const snuBuf = fs.readFileSync(snuPath);
  const snuTrimmed = await sharp(snuBuf).trim().toBuffer({ resolveWithObject: true });
  const snuAspect = snuTrimmed.info.width / snuTrimmed.info.height;
  const snuH = 62;
  const snuW = Math.round(snuH * snuAspect);
  const snuResized = await sharp(snuTrimmed.data)
    .resize(snuW, snuH, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();
  const snuFinal = await sharp({
    create: { width: canvasW, height: canvasH, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 0 } }
  })
    .composite([{ input: snuResized, gravity: 'centre' }])
    .webp({ quality: 95 })
    .toBuffer();
  fs.writeFileSync(path.join(universityDir, '12. Shiv Nadar University Chennai.webp'), snuFinal);
  console.log(`Updated 12. Shiv Nadar University Chennai.webp: ${snuW}x${snuH} in ${canvasW}x${canvasH}`);

  // 3. Karpagam Academy of Higher Education (from user's green logo in Downloads)
  const karpagamPath = path.join(downloadsDir, '2. Karpagam Academy of Higher Education.png');
  const karpagamBuf = fs.existsSync(karpagamPath) 
    ? fs.readFileSync(karpagamPath) 
    : fs.readFileSync(path.join(downloadsDir, '2. Karpagam Academy of Higher Education.webp'));
  const karpagamTrimmed = await sharp(karpagamBuf).trim().toBuffer({ resolveWithObject: true });
  const karpagamAspect = karpagamTrimmed.info.width / karpagamTrimmed.info.height;
  const karpagamH = 68;
  const karpagamW = Math.round(karpagamH * karpagamAspect);
  const karpagamResized = await sharp(karpagamTrimmed.data)
    .resize(karpagamW, karpagamH, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();
  const karpagamFinal = await sharp({
    create: { width: canvasW, height: canvasH, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 0 } }
  })
    .composite([{ input: karpagamResized, gravity: 'centre' }])
    .webp({ quality: 95 })
    .toBuffer();
  fs.writeFileSync(path.join(universityDir, '2. Karpagam Academy of Higher Education.webp'), karpagamFinal);
  console.log(`Updated 2. Karpagam Academy of Higher Education.webp: ${karpagamW}x${karpagamH} in ${canvasW}x${canvasH}`);

  // 4. Edwise-logo (increase size slightly: 94x94 instead of 72x72)
  const edwisePath = path.join(downloadsDir, '19. Edwise-logo.png');
  const edwiseBuf = fs.existsSync(edwisePath)
    ? fs.readFileSync(edwisePath)
    : fs.readFileSync(path.join(universityDir, '19. Edwise-logo.webp'));
  const edwiseTrimmed = await sharp(edwiseBuf).trim().toBuffer({ resolveWithObject: true });
  const edwiseAspect = edwiseTrimmed.info.width / edwiseTrimmed.info.height;
  const edwiseH = 94; // Increased size for prominence
  const edwiseW = Math.round(edwiseH * edwiseAspect);
  const edwiseResized = await sharp(edwiseTrimmed.data)
    .resize(edwiseW, edwiseH, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();
  const edwiseFinal = await sharp({
    create: { width: canvasW, height: canvasH, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 0 } }
  })
    .composite([{ input: edwiseResized, gravity: 'centre' }])
    .webp({ quality: 95 })
    .toBuffer();
  fs.writeFileSync(path.join(universityDir, '19. Edwise-logo.webp'), edwiseFinal);
  console.log(`Updated 19. Edwise-logo.webp (increased size): ${edwiseW}x${edwiseH} in ${canvasW}x${canvasH}`);

  console.log('All 4 logos updated successfully!');
}

updateAll().catch(console.error);
