# Flyrank Frontend Capstone By Raphael Cabigas

This repository contains files for the Flyrank Frontend AI Engineering Internship from July 2026.

**Live preview:** flyrank-frontend-capstone-raphael-cabigas.vercel.app

## Tech Stack

- Next.js (App Router)
- JavaScript (ES6+)
- Tailwind CSS
- ESLint
- Git / GitHub
- Vercel (deployment and preview URLs)

## Prerequisites

- Node.js `>=20.9`
- npm `>=9.x`

## Getting Started

```bash
# Clone the repo
git clone https://github.com/RaphaelCabigas/flyrank-frontend-capstone.git
cd flyrank-frontend-capstone

# Install dependencies
npm install

# Copy the env template and fill in your own values
cp .env.example .env.local

# Start the dev server (http://localhost:3000)
npm run dev

# Lint the project
npm run lint

# Build for production
npm run build

# Run the production build locally
npm run start
```

## Deployment

The repo is connected to Vercel. Every push builds a preview deployment, and the `main` branch deploys to production. Visit `/health` on any deployment to confirm it is running and fetching data correctly.

## Project Structure

```
src/
├── app/                # Routes, layouts, and pages (file-based routing)
│   ├── layout.jsx      # Root layout (shared shell and navigation)
│   ├── page.jsx        # Home page
│   ├── globals.css     # Tailwind import and design tokens (@theme)
│   ├── health/         # Health-check page that renders fetched data
│   └── <route>/        # One folder per screen, each with a page.jsx
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks (client-side)
├── lib/                # Helpers, data-fetching utilities, constants
└── assets/             # Images and icons
public/                 # Static files served as-is
```

## Coding Conventions

- Components use `PascalCase`; functions and variables use `camelCase`; route folders use `kebab-case`.
- One component per file, matching the filename to the component name.
- Keep components small and focused on a single responsibility.
- Components are Server Components by default. Add `'use client'` only where interactivity is required, and keep those components as small as possible.
- Style with Tailwind utility classes only. Design tokens (including the sky blue palette) are defined once in `src/app/globals.css`; do not add SCSS or per-component stylesheets.
- Build mobile-first and verify layouts at 375px and 1280px.
- Never commit secrets. Document required variables in `.env.example`.
- Linting is enforced via ESLint (see `eslint.config.mjs`). Run `npm run lint` and `npm run build` before committing.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat: add login form`, `fix: correct button alignment`).

See `CLAUDE.md` for the full set of conventions used when working with AI assistants.
