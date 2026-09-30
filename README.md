# Flyrank Frontend Capstone By Raphael Cabigas

This repository contains files for the Flyrank Frontend AI Engineering Internship from July 2026.

## Tech Stack

- React
- Vite
- JavaScript (ES6+)
- SCSS (Sass)
- Vitest + React Testing Library
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

# Run the tests
npm test

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

## StatusButton: motion notes

`StatusButton` moves through idle → hover/focus → press → loading → success or error → idle, and every change is a transition.

- **Label swap:** the leaving label exits in 140ms with an ease-in (it accelerates away), and the arriving label enters in 260ms with an ease-out after a 60ms stagger, so the two never blur together. Labels roll upward as the flow moves forward and reverse when it goes back (success → idle, error → loading), so the motion reads as progress or rewind.
- **Colour:** stacked fill layers crossfade over 300ms with `ease-in-out`. Fading opacity is compositor-friendly; transitioning `background-color` is not.
- **Hover, press, release:** hover 160ms in and 260ms out, press 80ms (fast, so it feels physical), release 300ms with a small spring overshoot.
- **Loading, success, error:** the spinner turns at constant speed (`linear`), because easing a loop reads as stalling. The success check pops in with an overshoot and holds for 1.8s. The error shake is one 420ms decaying wobble, and the error state stays until the person retries so a failure can't be missed.
- **No width animation:** width is a layout property, so all four labels share one grid cell and the widest one sets the width once. Nothing shifts during any transition.
- **Interruptible:** CSS transitions retarget from their current value, so hovering or clicking mid-transition never snaps. In JS, clicks are ignored while loading or showing success, retry works from error, and a run id stops stale promises from overwriting newer state.
- **Reduced motion:** the default styles are the reduced version (crossfades, colour change, icons, labels, and a slow opacity pulse instead of a spinning spinner). Movement (label roll, hover lift, press scale, check pop, shake, rotation) is only added under `prefers-reduced-motion: no-preference`, so feedback is never removed.
