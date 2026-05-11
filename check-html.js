const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-web-security'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://www.reddybook.live/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  // Remove modal
  await page.evaluate(() => {
    document.querySelectorAll('.modal, .modal-backdrop').forEach(m => m.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  });

  // Get bet-table-row HTML
  const rowHtml = await page.evaluate(() => {
    const row = document.querySelector('.bet-table-row');
    return row ? row.outerHTML.substring(0, 3000) : 'not found';
  });
  console.log('BET-TABLE-ROW HTML:\n', rowHtml);

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
