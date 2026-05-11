const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-web-security'] });

  const clone = await browser.newPage();
  await clone.setViewport({ width: 390, height: 844 });
  await clone.goto('http://localhost:3030/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  const cloneHeader = await clone.$('#header');
  if (cloneHeader) await cloneHeader.screenshot({ path: 'mobile-header-clone.png' });

  const orig = await browser.newPage();
  await orig.setViewport({ width: 390, height: 844 });
  await orig.goto('https://www.reddybook.live/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  await orig.evaluate(() => {
    document.querySelectorAll('.modal, .modal-backdrop').forEach(m => m.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  });
  await new Promise(r => setTimeout(r, 500));
  const origHeader = await orig.$('#header');
  if (origHeader) await origHeader.screenshot({ path: 'mobile-header-orig.png' });

  await browser.close();
  console.log('Done');
})().catch(e => { console.error(e); process.exit(1); });
