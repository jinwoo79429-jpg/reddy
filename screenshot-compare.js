const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // Desktop
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3030/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 8000));
  await page.screenshot({ path: 'clone-desktop-full.png', fullPage: true });
  await page.screenshot({ path: 'clone-desktop-viewport.png', fullPage: false });

  // Section crops
  const sections = [
    { sel: '#header', name: 'clone-header' },
    { sel: '.new-middle-menus', name: 'clone-middlenav' },
    { sel: '#sidebar', name: 'clone-sidebar' },
    { sel: '.bet-table-header', name: 'clone-sportheader' },
    { sel: '.bet-table-row', name: 'clone-sportrow' },
    { sel: '.casinoprovider-thumb-section', name: 'clone-casino' },
    { sel: '.commentary.marquee', name: 'clone-commentary' },
  ];
  for (const { sel, name } of sections) {
    try {
      const el = await page.$(sel);
      if (el) {
        await el.screenshot({ path: `${name}.png` });
        console.log(`Screenshot: ${name}`);
      } else {
        console.log(`Not found: ${sel}`);
      }
    } catch(e) { console.log(`Error for ${sel}: ${e.message}`); }
  }

  // Mobile
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:3030/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 8000));
  await page.screenshot({ path: 'clone-mobile-viewport.png', fullPage: false });
  await page.screenshot({ path: 'clone-mobile-full.png', fullPage: true });

  await browser.close();
  console.log('Done');
})().catch(e => { console.error(e); process.exit(1); });
