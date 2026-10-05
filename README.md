# YouTube Time is Money

A Chrome extension that makes YouTube's attention economy visible. It:

- **Blurs every video thumbnail** (grayscale + blur) so flashy previews can't bait you — hover to reveal the real image.
- **Shows what each video costs in your time**, as a red price pill on the thumbnail, based on your hourly rate. Works on the home feed, sidebar recommendations, and the end-of-video recommendation wall.
- **Kills autoplay hover previews** so nothing starts playing until you choose it.

## Install

1. Clone or download this repo.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top-right).
4. Click **Load unpacked** and select this folder.

## Usage

1. Click the **YouTube Time is Money** icon in the toolbar.
2. Enter **how much you earn per hour** and pick your **currency** (€ or $). Settings save automatically.
3. Open YouTube. Each thumbnail shows a red pill with the video's cost in your time (e.g. a 20-minute video at €30/hr shows **€10.00**). Hover a thumbnail to unblur it.

Change your rate or currency any time from the popup — prices update live.

## Development

```sh
npm install        # installs Playwright (used only to generate icons)
node test.js       # runs the pure-function unit tests
node gen-icons.js  # regenerates icon16/48/128.png from the inline SVG
```

- `content.js` — scans the page, parses durations, injects the cost pills.
- `content.css` — thumbnail blur/reveal + cost-pill styling.
- `options.html` / `options.js` — the settings popup.
