const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-web-security']
  });
  const page = await browser.newPage();

  // Capture WebSocket frames
  const wsMessages = [];
  const client = await page.target().createCDPSession();
  await client.send('Network.enable');

  client.on('Network.webSocketCreated', ({ requestId, url }) => {
    console.log('WS Created:', url);
  });

  client.on('Network.webSocketFrameReceived', ({ requestId, response }) => {
    if (wsMessages.length < 20) {
      wsMessages.push(response.payloadData);
      console.log('WS Frame:', response.payloadData.substring(0, 300));
    }
  });

  // Also capture XHR requests
  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('api') || url.includes('rate') || url.includes('odd') || url.includes('market')) {
      console.log('XHR:', res.status(), url.substring(0, 150));
      try {
        const text = await res.text();
        if (text.startsWith('{') || text.startsWith('[')) {
          console.log('  Body:', text.substring(0, 200));
        }
      } catch(e) {}
    }
  });

  console.log('Loading reddybook.live/home...');
  await page.goto('https://www.reddybook.live/home', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await new Promise(r => setTimeout(r, 8000));

  await browser.close();
  console.log('\nTotal WS messages captured:', wsMessages.length);
})().catch(e => { console.error(e); process.exit(1); });
