// Renders icon.svg -> icon16/48/128.png via Playwright. One-off: `node gen-icons.js`.
const { chromium } = require("playwright");

const svg = (s) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 128 128">
  <rect x="1" y="1" width="126" height="126" fill="#606060"
        stroke="#ff0000" stroke-width="2"/>
  <polygon points="50,40 50,88 90,64" fill="#ff0000"/>
</svg>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const s of [16, 48, 128]) {
    await p.setContent(svg(s));
    await p.locator("svg").screenshot({ path: `icon${s}.png`, omitBackground: true });
  }
  await b.close();
  console.log("icons written");
})();
