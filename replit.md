# TomoTrip (旅友) Landing Page

## Project Overview
A static landing page for TomoTrip, a platform that matches tourists with local guides in Japan. The page is primarily in Japanese with an English version available.

## Tech Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **No build system**: Files are served directly — no bundler, no framework
- **Server**: `serve` (npm package) used to serve static files in dev

## Project Structure
```
public/         # Main production files (served by web server)
  index.html    # Japanese landing page (main entry)
  styles.css    # Global styles
  main.js       # Client-side interactivity
  *.png, *.svg  # Image assets
en/             # English version of the landing page
backup/         # Historical versions for reference
```

## Development
- The app is served via `serve` on port 5000
- Workflow: "Start application" runs `serve public -l 5000`

## Deployment
- Configured as a **static** deployment
- Public directory: `public/`
- `vercel.json` specifies `outputDirectory: "public"` for Vercel

## Navigation Flow (Current)
- **観光客カード** → `app.tomotrip.com/tourist-registration-simple.html` (APP直行)
- **ガイドカード** → `app.tomotrip.com/guide-registration-v2.html` (APP直行)
- **協賛店カード** → LP内 `#sponsor-section` へスクロール → 最下部CTA → `app.tomotrip.com/sponsor-registration.html`
- **LINE** (`lin.ee/rsHMnPA`) = 補助導線（相談・案内用）
- 旧URL `tomotrip.com/shop-entry` は404 — LINE側で要差替

## Compliance & Copy History
- All guaranteed-income / MLM / dividend language removed (Rounds 1-3)
- Sponsor section uses "広告掲載・送客支援" framing with legal disclaimers
- First-view and modal copy softened (登録圧→柔らかい案内トーン)
  - Hero: "あなたに合った始め方を選ぶ"
  - Modal: "利用タイプを選んでください"
  - Cards: "〇〇の方へ" + "〇〇として進む"
- Image paths use bare filenames (no `public/` prefix) — web root = `public/`
