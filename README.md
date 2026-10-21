# saee.codes

Neovim-style interactive CV. Vite + Svelte, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Editing content

Everything lives in `src/content/`:

- `experience/<company>.ts`: one file per job. Add a file and it appears; `order` sets its position.
- `projects/<name>.ts`: same, for projects.
- `about.ts`: name, links, the three summaries (picked by the focus dial), languages, interests.
- `education.ts`, `skills.ts`.

Each bullet has `tags` and `importance`. They drive the focus dial; see `src/lib/types.ts`.

## Run

    npm install
    npm run dev
