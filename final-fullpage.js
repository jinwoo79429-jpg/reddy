const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3030/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 8000));
  await page.screenshot({ path: 'final-clone-fullpage.png', fullPage: true });
  console.log('Desktop fullpage done');

  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:3030/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 8000));
  await page.screenshot({ path: 'final-clone-mobile-full.png', fullPage: true });
  console.log('Mobile fullpage done');

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
