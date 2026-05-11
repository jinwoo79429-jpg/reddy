const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-web-security'] });

  // Clone nav
  const clonePage = await browser.newPage();
  await clonePage.setViewport({ width: 1440, height: 900 });
  await clonePage.goto('http://localhost:3030/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  const cloneNav = await clonePage.$('.new-middle-menus');
  if (cloneNav) await cloneNav.screenshot({ path: 'final-clone-nav.png' });

  // Original nav
  const origPage = await browser.newPage();
  await origPage.setViewport({ width: 1440, height: 900 });
  await origPage.goto('https://www.reddybook.live/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  await origPage.evaluate(() => {
    document.querySelectorAll('.modal, .modal-backdrop').forEach(m => m.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  });
  await new Promise(r => setTimeout(r, 500));
  const origNav = await origPage.$('.new-middle-menus');
  if (origNav) await origNav.screenshot({ path: 'final-orig-nav.png' });

  await browser.close();
  console.log('Done');
})().catch(e => { console.error(e); process.exit(1); });
