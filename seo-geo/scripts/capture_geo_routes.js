const { chromium } = require('C:/Users/eugen/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const outputRoot = path.resolve('seo-geo/runs/geo-recheck-2026-08-11/render-evidence');
const allRoutes = ['folsom-ca','fremont-ca','los-angeles-ca','orange-county-ca','roseville-ca','san-diego-ca','san-francisco-ca','san-jose-ca'];
const routes = process.env.GEO_ROUTE ? [process.env.GEO_ROUTE] : allRoutes;
const port = process.env.GEO_PORT || '8765';
const viewports = [[1684,1000],[390,844]];

(async () => {
  fs.mkdirSync(outputRoot, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/eugen/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe' });
  const cases = [];
  for (const slug of routes) for (const [width, height] of viewports) {
    const page = await browser.newPage({ viewport: { width, height } });
    const url = `http://127.0.0.1:${port}/service-areas/${slug}/`;
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(200);
    await page.evaluate(() => scrollTo(0, 0));
    const screenshotScrollY = await page.evaluate(() => scrollY);
    const viewportFile = path.join(outputRoot, `${slug}-${width}x${height}-viewport.png`);
    const file = path.join(outputRoot, `${slug}-${width}x${height}.png`);
    await page.screenshot({ path: viewportFile });
    await page.screenshot({ path: file, fullPage: true });
    const metrics = await page.evaluate(() => {
      const root = document.documentElement;
      const rects = [...document.querySelectorAll('main *')].map(el => ({ el, r: el.getBoundingClientRect() }));
      const clipped = rects.filter(({ r }) => r.width > 0 && (r.left < -1 || r.right > innerWidth + 1)).map(({ el }) => `${el.tagName.toLowerCase()}.${el.className || ''}`);
      const tinyText = rects.filter(({ el, r }) => r.width > 0 && getComputedStyle(el).fontSize !== '0px' && parseFloat(getComputedStyle(el).fontSize) < 14).map(({ el }) => `${el.tagName.toLowerCase()}.${el.className || ''}`);
      const header = document.querySelector('.site-header')?.getBoundingClientRect();
      return { clientWidth: root.clientWidth, scrollWidth: root.scrollWidth, clipped, tinyText, brokenImages: [...document.images].filter(i => i.complete && !i.naturalWidth).length, scrollY, header: header ? { top: header.top, bottom: header.bottom, width: header.width } : null, h1: document.querySelector('h1')?.innerText || '', title: document.title };
    });
    cases.push({ route: `/service-areas/${slug}/`, viewport: `${width}x${height}`, screenshotScrollY, viewportScreenshot: viewportFile, fullPageScreenshot: file, metrics, verdict: screenshotScrollY === 0 && metrics.scrollWidth === metrics.clientWidth && !metrics.clipped.length && !metrics.brokenImages ? 'technical-pass' : 'blocked' });
    console.log(`${slug} ${width}x${height}: ${cases.at(-1).verdict}`);
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(outputRoot, 'capture-manifest.json'), JSON.stringify({ schemaVersion: 'render-evidence.v1', cases }, null, 2));
})();
