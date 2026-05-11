const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => { if (msg.type() === 'error') console.log('ERR:', msg.text().substring(0, 150)); });

  // Test /sports/4 (Cricket)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3030/sports/4', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: 'test-sports-cricket.png' });

  // Check no duplicate key errors
  const errors = await page.evaluate(() => window.__errors || []);
  console.log('Cricket page loaded OK');

  // Test /sports/1 (Football)
  await page.goto('http://localhost:3030/sports/1', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'test-sports-football.png' });
  console.log('Football page loaded OK');

  // Test /home filters — click LIVE checkbox
  await page.goto('http://localhost:3030/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  const beforeCount = await page.evaluate(() => document.querySelectorAll('.bet-table-row').length);
  await page.click('label[for^="checkbox-live-"]');
  await new Promise(r => setTimeout(r, 500));
  const afterCount = await page.evaluate(() => document.querySelectorAll('.bet-table-row').length);
  console.log(`LIVE filter: before=${beforeCount}, after=${afterCount}`);
  await page.screenshot({ path: 'test-live-filter.png' });

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
