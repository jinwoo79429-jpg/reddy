const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-web-security'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://www.reddybook.live/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 5000));

  // Try to close any popup
  await page.evaluate(() => {
    // Click any close button or backdrop
    const btns = document.querySelectorAll('.modal .btn-close, .modal .close, .popup-close, [data-dismiss="modal"], .modal-backdrop');
    btns.forEach(b => b.click());
    // Also try escape key
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    // Remove modals directly
    document.querySelectorAll('.modal, .modal-backdrop').forEach(m => m.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'orig-desktop-clean.png', fullPage: false });

  // Crop sections
  const sections = [
    { sel: '#header', name: 'orig-header' },
    { sel: '.new-middle-menus', name: 'orig-middlenav' },
    { sel: '#sidebar', name: 'orig-sidebar' },
    { sel: '.bet-table-header', name: 'orig-sportheader' },
    { sel: '.bet-table-row', name: 'orig-sportrow' },
  ];
  for (const { sel, name } of sections) {
    try {
      const el = await page.$(sel);
      if (el) { await el.screenshot({ path: `${name}.png` }); console.log(`${name} done`); }
      else console.log(`Not found: ${sel}`);
    } catch(e) { console.log(`Error ${name}: ${e.message}`); }
  }

  // Mobile
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('https://www.reddybook.live/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  await page.evaluate(() => {
    document.querySelectorAll('.modal, .modal-backdrop').forEach(m => m.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'orig-mobile-clean.png', fullPage: false });
  console.log('Mobile done');

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
