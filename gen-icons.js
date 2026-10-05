// Renders icon.svg -> icon16/48/128.png via Playwright. One-off: `node gen-icons.js`.
const { chromium } = require("playwright");

const svg = (s) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="26" fill="#ff0000"/>
  <text x="64" y="94" text-anchor="middle" font-family="Roboto, Arial, sans-serif"
        font-size="92" font-weight="700" fill="#fff">$</text>
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
