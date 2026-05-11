const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://www.reddybook.live/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  const html = await page.evaluate(() => {
    const sidebar = document.querySelector('#sidebar-nav');
    if (!sidebar) return 'not found';
    // Get all top-level nav items
    const items = sidebar.querySelectorAll(':scope > li');
    let result = '';
    items.forEach(li => {
      const a = li.querySelector(':scope > a');
      if (!a) return;
      const img = a.querySelector('img');
      const span = a.querySelector('span') || a.querySelector('b');
      result += `ID: ${a.id || 'n/a'} | Class: ${a.className} | Icon: ${img?.src?.split('/').pop() || 'none'} | Name: ${span?.textContent?.trim() || a.textContent?.trim()}\n`;
    });
    return result;
  });
  console.log(html);

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
