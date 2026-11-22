const { chromium } = require('playwright');
(async () => {
  const dir = process.argv[2];
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1120, height: 1200 }, deviceScaleFactor: 1 });
  await p.goto('file://' + dir + '/shopee.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  const names = ['01_main', '02_features', '03_layers', '04_size', '05_photos', '06_usage'];
  const els = await p.$$('section.page');
  for (let i = 0; i < els.length; i++) {
    await els[i].screenshot({ path: dir + '/out/' + names[i] + '.png' });
  }
  const fams = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight).join(', '));
  console.log('fonts loaded:', fams.slice(0, 300));
  await b.close();
})();
