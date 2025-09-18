# Muneeb Hassan — Portfolio

A fast, accessible portfolio for design engineer Muneeb Hassan. Built with Next.js 14 (App Router), Tailwind CSS, Framer Motion, and `next-themes`. The site is statically exported and ready to deploy to GitHub Pages.

## Tech stack

- [Next.js 14](https://nextjs.org/) with the App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes) for theming
- Static content via JSON data files in `data/`

## Getting started

```bash
pnpm install
pnpm dev
```

The dev server runs on [http://localhost:3000](http://localhost:3000). Theme preference persists across reloads. Press the `T` key to toggle the theme from anywhere.

### Useful scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build and static export (outputs to `out/`) |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format files with Prettier |

## Content management

- **Projects carousel & detail pages:** Update `data/projects.json`. Each project must include a unique `slug`. The same data powers `/projects/[slug]` case study pages.
- **Building section:** Update `data/building.json` to adjust concurrent projects, statuses, and progress.
- **Writing links & connect info:** Update the arrays inside `app/page.tsx` (`writingLinks` and `connectLinks`).
- **Media assets:** Add previews in `public/media`. Images are currently SVG placeholders and can be replaced with WebP/PNG/MP4/WebM.

## GitHub Pages deployment

The repo ships with `.github/workflows/deploy.yml`, which builds and deploys the static export to GitHub Pages whenever the `main` branch updates.

1. Ensure the repository has GitHub Pages enabled with the **GitHub Actions** source.
2. Push to `main`. The workflow will:
   - Install dependencies with `pnpm`
   - Build with `NEXT_PUBLIC_GH_REPO=<repository-name>` to configure the base path
   - Upload the `out/` directory and publish via `actions/deploy-pages`

If you host under a custom domain, set `NEXT_PUBLIC_SITE_URL` in the workflow or repository secrets so `sitemap.xml` and `robots.txt` point to the right origin.

## Accessibility & performance

- WCAG AA contrast-aware color palette with dark mode as the default.
- Keyboard-focus styles applied to all interactive elements.
- Animations respect `prefers-reduced-motion` and scale back transitions where possible.
- Images are served through Next.js with `unoptimized: true` to support static export.

## Project structure

```
app/
  layout.tsx           # Root layout with theming & preview provider
  page.tsx             # Home page
  projects/[slug]/     # Case study routes
  (components)/        # UI components, carousel, long-press preview, etc.
data/
  projects.json        # Projects content
  building.json        # “Building now” content
public/
  media/               # Visual assets for projects
```

Feel free to adapt the design system tokens inside `app/globals.css` and `tailwind.config.ts` to explore new palettes or typography.
