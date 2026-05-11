const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://www.reddybook.live/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  const navHtml = await page.evaluate(() => {
    const nav = document.querySelector('.new-middle-menus');
    return nav ? nav.innerHTML.replace(/ _ngcontent-[a-z0-9-]+=[""]""/g, '') : 'not found';
  });
  console.log(navHtml.substring(0, 8000));

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
