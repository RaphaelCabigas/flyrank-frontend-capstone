# CLAUDE.md

## Project Overview

This project is built with Next.js (App Router) and Tailwind CSS. The goal is to create a clean, maintainable, responsive web application that is deployed from day one: every commit lands on a live Vercel preview URL.

## Tech Stack

- Next.js
- React
- JavaScript (ES6+)
- Tailwind CSS
- ESLint
- Git / GitHub
- Vercel

## Code Style

- Use functional React components and Hooks only.
- Use ES6+ syntax.
- Keep components focused on a single responsibility.
- Prefer reusable components over duplicated code.
- Use descriptive variable and function names.
- Avoid unnecessary dependencies. Ask before adding one.

## Server vs. Client Components

- Components are **Server Components by default**.
- Add `'use client'` only where interactivity is required (state, effects, event handlers, browser APIs).
- Push `'use client'` as far down the tree as possible. Extract the small interactive piece into its own client component instead of marking a whole page or layout as client.
- Fetch data in Server Components (async components / `fetch`), not in `useEffect`, unless the data depends on client-only state.

## File Structure

Use the `src/` directory with the App Router:

```
src/
├── app/                # Routes, layouts, pages (file-based routing)
│   ├── layout.jsx      # Root layout (shared shell + navigation)
│   ├── page.jsx        # Home
│   ├── globals.css     # Tailwind import + design tokens (@theme)
│   ├── health/
│   │   └── page.jsx    # Health-check page that renders fetched data
│   └── <route>/page.jsx
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks (client-side)
├── lib/                # Helpers, data-fetching utilities, constants
└── assets/             # Images and icons (or /public for static files)
```

- Every screen in the project spec must exist as a routed placeholder page (`app/<route>/page.jsx`).
- Shared chrome (header, navigation, footer) lives in the root layout, not repeated per page.
- Use `next/link` for internal navigation, `next/image` for images.
- Route files follow Next.js conventions (`page.jsx`, `layout.jsx`, `loading.jsx`, `error.jsx`, `not-found.jsx`).

## Styling: Tailwind Only

- Style exclusively with Tailwind utility classes in JSX. Do not create SCSS, `.module.css`, or per-component stylesheets.
- The only CSS file is `src/app/globals.css`, which contains the Tailwind import and the design tokens.
- Define design tokens once, in `globals.css`, using Tailwind's `@theme` block. Do not hardcode hex values in components.
- **Palette: sky blue.** Use Tailwind's built-in `sky` scale as the brand palette, exposed through semantic tokens (for example `brand`, `brand-hover`, `surface`, `muted`) so components say `bg-brand` instead of `bg-sky-500`. If a needed token doesn't exist, add it to `globals.css`, not to a component.
- Do not add external font or asset imports (`@import url(...)`, `<link>` to Google Fonts). Use `next/font` once in the root layout.
- Extract repeated class combinations into a React component, not into `@apply` rules. Use `@apply` sparingly or not at all.
- Mobile-first: write base styles for small screens, then layer on `sm:`, `md:`, `lg:`, `xl:` variants.
- Every page and component must work at **375px** and **1280px** widths, with no horizontal scrolling.
- Support dark mode only if the spec asks for it.

## Naming Conventions

### React Components

Use PascalCase for component files and names.

```
Header.jsx
HeroSection.jsx
FeatureCard.jsx
```

### Variables and Functions

Use camelCase.

```javascript
userData;
handleSubmit;
fetchProducts;
isLoading;
```

### Routes and Folders

Use kebab-case for route folder names (`app/order-history/page.jsx`).

## Deployment (Vercel)

- The GitHub repo is connected to Vercel. Every push builds a preview deployment.
- Before considering a task done, `npm run build` must pass locally. The preview URL must load with no build errors.
- Keep the health-check page (`/health`) working. It renders data fetched on the server so a deployment can be verified end to end.

## Form & Validation Rules

- Always `.trim()` string input (especially email addresses) before running it through a validation regex.
- Validation logic must be extracted into a standalone, exported function (e.g. `validateFields`) in `src/lib`, not left as a closure inside the component.
- Every input has an associated `<label>`. Errors use `aria-invalid` and `aria-describedby`.
- Any interactive toggle button (show/hide password, expand/collapse, etc.) must set `aria-pressed` reflecting its current boolean state.
- Focus states must be visible (use Tailwind `focus-visible:` utilities).

## AI Assistant Guidelines

When generating code:

- Follow the existing project structure.
- Use Tailwind utility classes. Never SCSS or plain CSS files.
- Default to Server Components. Justify every `'use client'`.
- Reuse the design tokens in `globals.css` rather than inventing new ones.
- Do not rename existing files, routes, or components unless requested.
- Reuse existing components whenever possible.
- Prefer simple and maintainable solutions.
- Never write secrets into the repo, even as placeholders that look real.
- Finish by running lint and build, not just by confirming that it renders.

## Git Workflow

Use Conventional Commits. Commit often, since every push produces a preview deployment.

Examples:

- `feat: add hero section`
- `fix: resolve mobile navigation layout`
- `style: update header spacing`
- `refactor: simplify card component`
- `docs: update README`
- `chore: add env var template`
