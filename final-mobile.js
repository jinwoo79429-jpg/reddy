const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-web-security'] });

  const clone = await browser.newPage();
  await clone.setViewport({ width: 390, height: 844 });
  await clone.goto('http://localhost:3030/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 8000));
  await clone.screenshot({ path: 'final-clone-mobile.png', fullPage: false });

  const orig = await browser.newPage();
  await orig.setViewport({ width: 390, height: 844 });
  await orig.goto('https://www.reddybook.live/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 5000));
  await orig.evaluate(() => {
    document.querySelectorAll('.modal, .modal-backdrop').forEach(m => m.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  });
  await new Promise(r => setTimeout(r, 500));
  await orig.screenshot({ path: 'final-orig-mobile.png', fullPage: false });

  await browser.close();
  console.log('Done');
})().catch(e => { console.error(e); process.exit(1); });
