const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-web-security'] });

  // Clone mobile sport row
  const clonePage = await browser.newPage();
  await clonePage.setViewport({ width: 390, height: 844 });
  await clonePage.goto('http://localhost:3030/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 8000));
  const cloneRow = await clonePage.$('.bet-table-row');
  if (cloneRow) {
    await cloneRow.screenshot({ path: 'clone-mobile-row.png' });
    console.log('Clone mobile row done');
  }

  // Original mobile sport row
  const origPage = await browser.newPage();
  await origPage.setViewport({ width: 390, height: 844 });
  await origPage.goto('https://www.reddybook.live/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 5000));
  await origPage.evaluate(() => {
    document.querySelectorAll('.modal, .modal-backdrop').forEach(m => m.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  });
  await new Promise(r => setTimeout(r, 1000));
  const origRow = await origPage.$('.bet-table-row');
  if (origRow) {
    await origRow.screenshot({ path: 'orig-mobile-row.png' });
    console.log('Orig mobile row done');
  }

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
