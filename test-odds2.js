const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  page.on('response', async res => {
    const url = res.url();
    const status = res.status();
    if (status >= 400 || url.includes('ocric99') || url.includes('getMarket') || url.includes('odd.')) {
      console.log('RESPONSE', status, url.substring(0, 150));
      if (status >= 400) {
        try { console.log('  BODY:', (await res.text()).substring(0, 300)); } catch(e) {}
      }
    }
  });

  await page.goto('http://localhost:3030/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log('Page loaded, waiting 5s...');
  await new Promise(r => setTimeout(r, 5000));

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
