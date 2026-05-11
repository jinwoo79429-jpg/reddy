const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // Intercept console messages
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  // Track network requests to the odds API
  page.on('request', req => {
    if (req.url().includes('ocric99') || req.url().includes('getMarket')) {
      console.log('REQUEST:', req.url().substring(0, 100));
    }
  });
  page.on('response', async res => {
    if (res.url().includes('ocric99') || res.url().includes('getMarket')) {
      console.log('RESPONSE:', res.status(), res.url().substring(0, 100));
      try {
        const text = await res.text();
        console.log('  BODY:', text.substring(0, 200));
      } catch(e) {}
    }
  });

  await page.goto('http://localhost:3030/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log('Page loaded, waiting 8s...');
  await new Promise(r => setTimeout(r, 8000));

  // Check if odds rendered
  const oddsText = await page.evaluate(() => {
    const cells = document.querySelectorAll('.bet-button-price');
    const texts = Array.from(cells).slice(0, 6).map(c => c.textContent.trim());
    return texts;
  });
  console.log('Odds cells:', oddsText);

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
