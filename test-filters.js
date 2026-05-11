const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text().substring(0, 200));
  });
  await page.setViewport({ width: 1440, height: 900 });

  // --- Test /sports/4 (Cricket) nav active state ---
  await page.goto('http://localhost:3030/sports/4', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  const activeNav = await page.evaluate(() => {
    const active = document.querySelector('.nmm-active');
    return active ? active.textContent.trim() : 'none';
  });
  console.log(`Cricket page active nav: "${activeNav}"`);

  const cricketRows = await page.evaluate(() => document.querySelectorAll('.bet-table-row').length);
  const liveCount = await page.evaluate(() => document.querySelectorAll('.game-date.inplay').length);
  console.log(`Cricket: ${cricketRows} rows, ${liveCount} live`);

  // PREMIUM filter test
  await page.click('label[for^="checkbox-premium-"]');
  await new Promise(r => setTimeout(r, 300));
  const premiumRows = await page.evaluate(() => document.querySelectorAll('.bet-table-row').length);
  console.log(`After PREMIUM filter: ${premiumRows} rows`);
  await page.click('label[for^="checkbox-premium-"]');
  await new Promise(r => setTimeout(r, 200));

  await page.screenshot({ path: 'test-cricket-nav.png' });

  // --- Football page ---
  await page.goto('http://localhost:3030/sports/1', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  const activeNavFoot = await page.evaluate(() => {
    const active = document.querySelector('.nmm-active');
    return active ? active.textContent.trim() : 'none';
  });
  console.log(`Football page active nav: "${activeNavFoot}"`);
  const footRows = await page.evaluate(() => document.querySelectorAll('.bet-table-row').length);
  console.log(`Football: ${footRows} rows`);
  await page.screenshot({ path: 'test-football-nav.png' });

  // --- Home page ---
  await page.goto('http://localhost:3030/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  const activeNavHome = await page.evaluate(() => {
    const active = document.querySelector('.nmm-active');
    return active ? active.textContent.trim() : 'none';
  });
  console.log(`Home page active nav: "${activeNavHome}"`);

  // Duplicate key errors check
  const keyErrors = errors.filter(e => e.includes('key'));
  const otherErrors = errors.filter(e => !e.includes('key') && !e.includes('ERR_NAME_NOT_RESOLVED'));
  console.log(`\nDuplicate key errors: ${keyErrors.length}`);
  console.log(`Other errors: ${otherErrors.length}`);
  if (otherErrors.length > 0) otherErrors.forEach(e => console.log('  >', e));

  await browser.close();
  console.log('\nDone.');
})().catch(e => { console.error(e); process.exit(1); });
