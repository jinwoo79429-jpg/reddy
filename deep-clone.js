const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (!url || url.startsWith('data:')) return resolve();
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    const req = client.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        const loc = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
        return download(loc, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) { file.close(); return resolve(); }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    });
    req.on('error', err => { file.close(); fs.unlink(dest, () => {}); reject(err); });
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

const BASE = 'https://www.reddybook.live';
const CDN = 'https://speedcdn.io';
const OUT = 'public';

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-web-security'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Intercept network to capture ALL asset URLs
  const assetUrls = new Set();
  page.on('response', async (res) => {
    const url = res.url();
    const type = res.request().resourceType();
    if (['stylesheet', 'image', 'font', 'script'].includes(type)) {
      assetUrls.add(url);
    }
  });

  console.log('Loading reddybook.live/home...');
  await page.goto(`${BASE}/home`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));

  // Take reference screenshots at various viewports
  await page.setViewport({ width: 1440, height: 900 });
  await page.screenshot({ path: 'ref-desktop-viewport.png', fullPage: false });
  await page.screenshot({ path: 'ref-desktop-full.png', fullPage: true });

  // Section crops via JS
  const sections = [
    { sel: '#header', name: 'ref-header' },
    { sel: '.new-middle-menus', name: 'ref-middlenav' },
    { sel: '#sidebar', name: 'ref-sidebar' },
    { sel: '.bet-table-header', name: 'ref-sportheader' },
    { sel: '.bet-table-row', name: 'ref-sportrow' },
    { sel: '.casinoprovider-thumb-section', name: 'ref-casino' },
    { sel: '.livematch', name: 'ref-livematch' },
    { sel: '.commentary.marquee', name: 'ref-commentary' },
  ];
  for (const { sel, name } of sections) {
    try {
      const el = await page.$(sel);
      if (el) {
        await el.screenshot({ path: `${name}.png` });
        console.log(`Section screenshot: ${name}`);
      }
    } catch(e) {}
  }

  // Mobile
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`${BASE}/home`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: 'ref-mobile-viewport.png', fullPage: false });
  await page.screenshot({ path: 'ref-mobile-full.png', fullPage: true });

  // Get ALL CSS content (including Angular component styles)
  const allCSS = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('style')).map(s => ({
      id: s.id || 'inline',
      content: s.textContent
    }));
  });
  fs.writeFileSync('ref-angular-styles.css', allCSS.map(s => `/* === ${s.id} === */\n${s.content}`).join('\n\n'));
  console.log('Angular inline styles saved:', allCSS.length, 'style blocks');

  // Extract precise computed styles for EVERY key element
  const fullStyles = await page.evaluate(() => {
    const sels = [
      // Header
      '#header', '.header', '.logo', '.logo img', '.toggle-sidebar-btn',
      '.livematch', '.lm_icon', '.lm_datas', '.lm_datas div', '.lm_datas b',
      '.search-bar', '.search-form', '.search-form input', '.search-form button',
      'a.rules', '.btn-login', '.header-nav',
      // Middle nav
      '.new-middle-menus', '.new-middle-menus ul', '.new-middle-menus ul li',
      '.new-middle-menus ul li a', '.new-middle-menus ul li a img',
      '.new-middle-menus ul li a.nmm-active', '.hightlight-menu',
      // Sidebar
      '#sidebar', '.sidebar', '.sidebar-nav', '.sidebar-nav .nav-item',
      '.sidebar-nav .nav-link', '.sidebar-nav .nav-link img', '.sidebar-nav .nav-link span',
      '.sidebar-nav .nav-content', '.sidebar-nav .nav-content a',
      // Main
      '#main', '.listing_page', '.bet-table-header', '.bet-table-body', '.bet-table-row',
      '.game-box', '.game-left-col', '.game-name', '.team-name', '.team-event',
      '.game-date', '.game-date.inplay', '.game-date.inplay span',
      '.game-icons', '.icon-tv', '.icon-tv img', '.game-bm', '.add-pin',
      '.h-backLay', '.back.bl-box', '.lay.bl-box', '.bet-button-price', '.bet-button-price em',
      '.list-sport-title', '.list-sport-title img', '.ks-cboxtags', '.ks-cboxtags li',
      '.ks-cboxtags label',
      // Commentary
      '.commentary.marquee', '.commentary.marquee img', '.commentary.marquee span',
      // Casino
      '.casinoprovider-thumb-section', '.casinoprovider-thumb-section .cts-img',
      '.casinoprovider-thumb-section img',
      // Body
      'body', '#main',
    ];
    const result = {};
    sels.forEach(sel => {
      const el = document.querySelector(sel);
      if (!el) return;
      const cs = getComputedStyle(el);
      result[sel] = {
        display: cs.display,
        position: cs.position,
        top: cs.top, left: cs.left, right: cs.right, bottom: cs.bottom,
        width: cs.width, height: cs.height,
        minWidth: cs.minWidth, maxWidth: cs.maxWidth,
        minHeight: cs.minHeight, maxHeight: cs.maxHeight,
        margin: cs.margin, padding: cs.padding,
        background: cs.background.substring(0, 150),
        backgroundColor: cs.backgroundColor,
        color: cs.color,
        fontSize: cs.fontSize, fontWeight: cs.fontWeight, fontFamily: cs.fontFamily,
        lineHeight: cs.lineHeight,
        border: cs.border, borderRadius: cs.borderRadius,
        flexDirection: cs.flexDirection, flexWrap: cs.flexWrap,
        alignItems: cs.alignItems, justifyContent: cs.justifyContent,
        gap: cs.gap,
        gridTemplateColumns: cs.gridTemplateColumns,
        overflow: cs.overflow, overflowX: cs.overflowX, overflowY: cs.overflowY,
        whiteSpace: cs.whiteSpace,
        textTransform: cs.textTransform, textDecoration: cs.textDecoration,
        cursor: cs.cursor,
        zIndex: cs.zIndex,
        boxShadow: cs.boxShadow,
        transition: cs.transition,
        opacity: cs.opacity,
        transform: cs.transform,
        verticalAlign: cs.verticalAlign,
        objectFit: cs.objectFit,
        letterSpacing: cs.letterSpacing,
      };
    });
    return result;
  });
  fs.writeFileSync('ref-full-computed-styles.json', JSON.stringify(fullStyles, null, 2));
  console.log('Full computed styles saved for', Object.keys(fullStyles).length, 'elements');

  // Get exact HTML for key sections (cleaned)
  const sections2 = {
    header: '#header',
    middlenav: '.new-middle-menus',
    sidebar: '#sidebar',
    firstSportList: 'app-sport-list',
    casinoSection: '.casinoprovider-thumb-section',
    commentaryBar: '.commentary.marquee',
    betTableRow: '.bet-table-row',
    betTableHeader: '.bet-table-header',
  };
  const htmlSections = {};
  for (const [name, sel] of Object.entries(sections2)) {
    const html = await page.evaluate((s) => {
      const el = document.querySelector(s);
      return el ? el.outerHTML.replace(/_ngcontent-[a-z0-9-]+=""/g, '').replace(/\s+/g, ' ').substring(0, 3000) : '';
    }, sel);
    htmlSections[name] = html;
  }
  fs.writeFileSync('ref-html-sections.json', JSON.stringify(htmlSections, null, 2));
  console.log('HTML sections saved');

  // Download ALL CSS files from the site
  const cssFiles = [
    [`${BASE}/assets/css/bootstrap/css/bootstrap.min.css`, `${OUT}/assets/css/bootstrap/css/bootstrap.min.css`],
    [`${BASE}/assets/css/swiper-bundle.min.css`, `${OUT}/assets/css/swiper-bundle.min.css`],
    [`${BASE}/assets/css/bootstrap-icons/bootstrap-icons.css`, `${OUT}/assets/css/bootstrap-icons/bootstrap-icons.css`],
    [`${BASE}/assets/css/simple-datatables/style.css`, `${OUT}/assets/css/simple-datatables/style.css`],
    [`${BASE}/assets/css/common_style.css`, `${OUT}/assets/css/common_style.css`],
    [`${BASE}/styles.93fcb30fe890d8844e0e.css`, `${OUT}/assets/css/styles.css`],
    [`${BASE}/assets/css/theme_master.css`, `${OUT}/assets/css/theme_master.css`],
  ];

  console.log('\nDownloading CSS files...');
  for (const [url, dest] of cssFiles) {
    try {
      await download(url, dest);
      const size = fs.existsSync(dest) ? fs.statSync(dest).size : 0;
      console.log(`  ${size > 0 ? '✓' : '✗'} ${path.basename(dest)} (${size} bytes)`);
    } catch(e) { console.log(`  ✗ ${url}: ${e.message}`); }
  }

  // Download ALL images referenced in page
  console.log('\nCollecting image URLs...');
  const imageUrls = await page.evaluate(() => {
    const imgs = new Set();
    document.querySelectorAll('img').forEach(img => { if(img.src) imgs.add(img.src); });
    // Also get CSS background images
    document.querySelectorAll('*').forEach(el => {
      const bg = getComputedStyle(el).backgroundImage;
      if (bg && bg !== 'none') {
        const match = bg.match(/url\(["']?([^"')]+)["']?\)/);
        if (match && match[1]) imgs.add(match[1]);
      }
    });
    return Array.from(imgs);
  });

  console.log(`Found ${imageUrls.length} images`);

  // Download images that are from reddybook.live or speedcdn.io
  let downloaded = 0;
  for (const url of imageUrls) {
    let dest = null;
    if (url.startsWith(`${BASE}/assets/`)) {
      dest = OUT + url.replace(BASE, '');
    } else if (url.startsWith(`${CDN}/assets/`)) {
      dest = `${OUT}/cdn/assets/${url.replace(`${CDN}/assets/`, '')}`;
    } else if (url.startsWith(`${CDN}/frontend_config/`)) {
      dest = `${OUT}/cdn/frontend_config/${url.replace(`${CDN}/frontend_config/`, '')}`;
    }
    if (dest) {
      try {
        await download(url, dest);
        downloaded++;
      } catch(e) {}
    }
  }
  console.log(`Downloaded ${downloaded} images`);

  // Download bootstrap-icons fonts
  const biBase = `${BASE}/assets/css/bootstrap-icons`;
  await download(`${biBase}/fonts/bootstrap-icons.woff2`, `${OUT}/assets/css/bootstrap-icons/fonts/bootstrap-icons.woff2`);
  await download(`${biBase}/fonts/bootstrap-icons.woff`, `${OUT}/assets/css/bootstrap-icons/fonts/bootstrap-icons.woff`);
  console.log('Bootstrap icons fonts downloaded');

  await browser.close();
  console.log('\nAll done!');
})().catch(e => { console.error(e); process.exit(1); });
