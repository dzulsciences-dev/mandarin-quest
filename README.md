# Mandarin Quest

Your Mandarin adventure starts here — a mobile-first Mandarin learning PWA for Malaysian beginners.

Mandarin Quest teaches useful actions and sentence patterns through Malaysian everyday situations. Lessons use Simplified Chinese, Hanyu Pinyin, and friendly English and Bahasa Melayu explanations.

## Run locally

Requires Node.js 20.19+ (Node 24 recommended) and pnpm.

```sh
pnpm install
pnpm dev
```

Open the local URL Vite prints (usually `http://127.0.0.1:5173/`). To check the production build:

```sh
pnpm build
pnpm preview
```

The production build uses the `/mandarin-quest/` base path required by GitHub Pages. Preview it at `http://127.0.0.1:4173/mandarin-quest/`.

## GitHub Pages

The site is configured for the repository `mandarin-quest`. After pushing the `main` branch, GitHub Actions builds and deploys `dist/` to Pages. The expected URL is:

`https://YOUR-GITHUB-USERNAME.github.io/mandarin-quest/`

In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions** if GitHub has not enabled it automatically. Wait for the **Deploy to GitHub Pages** workflow to finish, then use the URL shown in the workflow's `github-pages` environment. GitHub Pages serves the site over HTTPS.

To install on iPhone, open the published URL in Safari, tap **Share → Add to Home Screen**, then tap **Add**. Open the app once while online so its service worker can cache the shell and assets; previously cached lessons can then load offline.

After future changes, push or merge them to `main`. The GitHub Actions workflow builds and deploys each update automatically.

## MVP contents

- Dashboard, learning path, Pinyin tone guide, action phrase lessons, and mixed practice.
- Correct-answer feedback, XP, levels, daily streak and mission, lesson completion, and achievements.
- Progress saved locally in the browser. Nothing is sent to a backend.
- Web app manifest, install icons, and a service worker that caches the app shell and same-origin assets.

Mandarin examples use Simplified Chinese and Hanyu Pinyin. Audio recordings are not included yet; Pinyin is shown directly and the interface does not claim a recording exists.
