const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-web-security'] });

  // Screenshot the original site
  const origPage = await browser.newPage();
  await origPage.setViewport({ width: 1440, height: 900 });
  try {
    await origPage.goto('https://www.reddybook.live/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 5000));
    await origPage.screenshot({ path: 'orig-desktop-viewport.png', fullPage: false });
    await origPage.screenshot({ path: 'orig-desktop-full.png', fullPage: true });
    console.log('Original desktop done');
  } catch(e) { console.log('Original failed:', e.message); }

  // Original mobile
  await origPage.setViewport({ width: 390, height: 844 });
  try {
    await origPage.goto('https://www.reddybook.live/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));
    await origPage.screenshot({ path: 'orig-mobile-viewport.png', fullPage: false });
    console.log('Original mobile done');
  } catch(e) { console.log('Original mobile failed:', e.message); }

  await browser.close();
  console.log('Done');
})().catch(e => { console.error(e); process.exit(1); });
