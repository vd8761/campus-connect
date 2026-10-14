async function checkAmityEdu() {
  try {
    const res = await fetch('https://www.amity.edu', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const matches = [...html.matchAll(/<img[^>]+src=["']([^"']*(?:logo|amity)[^"']*)["']/gi)];
    console.log('Matches:', matches.map(m => m[1]).slice(0, 10));
  } catch(e) {
    console.error(e.message);
  }
}
checkAmityEdu();
