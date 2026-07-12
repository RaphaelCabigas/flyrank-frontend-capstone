# Flyrank Frontend Capstone By Raphael Cabigas

This repository contains files for the Flyrank Frontend AI Engineering Internship from July 2026.

## Tech Stack

- React
- Vite
- JavaScript (ES6+)
- SCSS (Sass)
- Git / GitHub

## Prerequisites

- Node.js `>=18.x`
- npm `>=9.x`

## Getting Started

```bash
# Clone the repo
git clone [https://github.com/RaphaelCabigas/flyrank-frontend-capstone]
cd [flyrank-frontend-capstone]

# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
src/
├── assets/         # Static assets (images, fonts)
├── components/     # Reusable UI components
├── pages/          # Route-level views
├── styles/         # Global and shared SCSS
├── hooks/          # Custom React hooks
├── utils/          # Helper functions
└── main.jsx        # App entry point
```

## Coding Conventions

- Components use `PascalCase`; functions and variables use `camelCase`.
- One component per file, matching the filename to the component name.
- Keep components small and focused on a single responsibility.
- SCSS follows a `_variables.scss` / `_mixins.scss` partial pattern imported via a single entry stylesheet.
- Linting is enforced via ESLint (see `.eslintrc` / `eslint.config.js`) — run `npm run lint` before committing.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat: add login form`, `fix: correct button alignment`).
