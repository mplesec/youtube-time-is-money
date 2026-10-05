const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const ext = __dirname;
  const ctx = await chromium.launchPersistentContext("", {
    headless: false, // MV3 extensions require a full (headed) browser
    args: [
      `--disable-extensions-except=${ext}`,
      `--load-extension=${ext}`,
    ],
  });

  const page = await ctx.newPage();
  await page.goto("https://www.youtube.com/results?search_query=lofi", {
    waitUntil: "domcontentloaded",
  });
  // let thumbnails load + mutation observer + storage default kick in
  await page.waitForTimeout(6000);

  const r = await page.evaluate(() => {
    const costs = [...document.querySelectorAll(".ytm-cost")].map((e) => e.textContent);
    const img = document.querySelector("ytd-thumbnail img, yt-thumbnail-view-model img");
    const filtered = img ? getComputedStyle(img).filter : "no-img";
    return { pills: costs.length, sample: costs.slice(0, 6), filter: filtered };
  });

  console.log(JSON.stringify(r, null, 2));
  await ctx.close();
  if (r.pills === 0) process.exit(1);
  if (!/blur/.test(r.filter)) process.exit(2);
  console.log("PASS");
})().catch((e) => {
  console.error(e.message);
  process.exit(3);
});
