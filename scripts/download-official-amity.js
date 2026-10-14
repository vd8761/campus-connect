const sharp = require('sharp');
const fs = require('fs');

async function downloadOfficialAmity() {
  const url = 'https://amity.edu/images/logo-amity.png';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync('C:/Users/HP/.gemini/antigravity-ide/brain/4c7a3a1b-7307-495e-a8b5-f5f7167a6848/amity_official.png', buf);
  const meta = await sharp(buf).metadata();
  console.log('Official Amity metadata:', meta);
}
downloadOfficialAmity().catch(console.error);
