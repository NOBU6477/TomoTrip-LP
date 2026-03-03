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
