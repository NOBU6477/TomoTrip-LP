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

## Compliance & Copy History
- All guaranteed-income / MLM / dividend language removed (Rounds 1-3)
- Sponsor section uses "広告掲載・送客支援" framing with legal disclaimers
- First-view and modal copy softened (登録圧→柔らかい案内トーン)
  - Hero: "あなたに合った始め方を選ぶ" (was "公式アプリで登録を始める")
  - Modal: "ご利用タイプを選択してください" (was "LINE登録")
  - Cards: "〇〇向け" + "〇〇として進む" (was "〇〇登録")
- Image paths use bare filenames (no `public/` prefix) — web root = `public/`
