/* YT Money — blur thumbnails + show cost of your time per video */

const DEFAULTS = { rate: 30, currency: "EUR" };
const SYM = { EUR: "€", USD: "$" };
let cfg = { ...DEFAULTS };

// pure: "1:02:33" / "10:23" / "0:59" -> seconds, else null
function parseDur(t) {
  const m = t && t.match(/(?:(\d+):)?(\d{1,2}):(\d{2})(?!\d)/);
  if (!m) return null;
  return (+(m[1] || 0)) * 3600 + +m[2] * 60 + +m[3];
}

// pure: seconds -> money string at current rate
function fmt(sec, c = cfg) {
  const money = (c.rate * sec) / 3600;
  return (SYM[c.currency] || "") + money.toFixed(2);
}

const TIME_SEL = [
  "ytd-thumbnail-overlay-time-status-renderer",
  "yt-thumbnail-overlay-badge-view-model .badge-shape",
  ".badge-shape-wrap .badge-shape",
  "badge-shape", // new lockup layout (watch page / recs): <badge-shape class="ytBadgeShapeHost">
  ".ytp-videowall-still-info-duration", // end-of-video recommendation wall
].join(",");

const CONT_SEL = "ytd-thumbnail, yt-thumbnail-view-model, a#thumbnail, #thumbnail, .ytp-videowall-still";

function scan() {
  document.querySelectorAll(TIME_SEL).forEach((el) => {
    const sec = parseDur(el.textContent);
    if (sec == null) return; // skips LIVE / 4K / SHORTS badges
    const cont = el.closest(CONT_SEL) || el.parentElement;
    if (!cont) return;
    let badge = cont.querySelector(":scope > .ytm-cost");
    if (!badge) {
      if (getComputedStyle(cont).position === "static") cont.style.position = "relative";
      badge = document.createElement("div");
      badge.className = "ytm-cost";
      cont.appendChild(badge);
    }
    badge.dataset.sec = sec;
    badge.textContent = fmt(sec);
  });
}

function refresh() {
  document.querySelectorAll(".ytm-cost").forEach((b) => {
    b.textContent = fmt(+b.dataset.sec);
  });
}

// Browser only — guarded so node can import the pure fns for tests.
if (typeof chrome !== "undefined" && chrome.storage) {
  chrome.storage.sync.get(DEFAULTS).then((v) => {
    cfg = v;
    scan();
  });
  chrome.storage.onChanged.addListener((ch) => {
    if (ch.rate) cfg.rate = ch.rate.newValue;
    if (ch.currency) cfg.currency = ch.currency.newValue;
    refresh();
  });

  let pending;
  new MutationObserver(() => {
    clearTimeout(pending);
    pending = setTimeout(scan, 300);
  }).observe(document.documentElement, { childList: true, subtree: true });
}

if (typeof module !== "undefined") module.exports = { parseDur, fmt };
