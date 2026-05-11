const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-web-security'] });

  // Clone desktop full
  const clonePage = await browser.newPage();
  await clonePage.setViewport({ width: 1440, height: 900 });
  await clonePage.goto('http://localhost:3030/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 8000));
  await clonePage.screenshot({ path: 'final-clone-desktop.png', fullPage: false });

  // Original desktop full
  const origPage = await browser.newPage();
  await origPage.setViewport({ width: 1440, height: 900 });
  await origPage.goto('https://www.reddybook.live/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 5000));
  await origPage.evaluate(() => {
    document.querySelectorAll('.modal, .modal-backdrop').forEach(m => m.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  });
  await new Promise(r => setTimeout(r, 500));
  await origPage.screenshot({ path: 'final-orig-desktop.png', fullPage: false });

  await browser.close();
  console.log('Done');
})().catch(e => { console.error(e); process.exit(1); });
