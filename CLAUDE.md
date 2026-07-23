# CLAUDE.md

## Project Overview

This project is built with React and Vite. The goal is to create a clean, maintainable, and responsive web application while following consistent coding and styling conventions.

## Tech Stack

- React
- Vite
- JavaScript (ES6+)
- SCSS (Sass)
- Vitest + React Testing Library
- Git
- GitHub

## Code Style

- Use functional React components.
- Use React Hooks instead of class components.
- Use ES6+ syntax.
- Keep components focused on a single responsibility.
- Prefer reusable components over duplicated code.
- Use descriptive variable and function names.

## File Structure

- Organize reusable UI inside `src/components`.
- Store page-level components in `src/pages`.
- Keep images and icons in `src/assets`.
- Place SCSS files alongside the component they style when appropriate.
- Co-locate a `*.test.jsx` file next to each component that has form logic,
  validation, or conditional rendering.

## SCSS Conventions

- Use SCSS for all styling.
- Nest selectors only when it improves readability.
- Avoid excessive selector nesting.
- Group related styles together.
- Keep styles modular and component-specific.

## Naming Conventions

### CSS Classes

Use kebab-case (dash-separated) for all class names.

Examples:

```
head-wrapper
head-container
hero-section
feature-card
primary-button
```

### React Components

Use PascalCase.

Examples:

```
Header.jsx
HeroSection.jsx
FeatureCard.jsx
```

### Variables and Functions

Use camelCase.

Examples:

```javascript
userData;
handleSubmit;
fetchProducts;
isLoading;
```

## Form & Validation Rules

- Always `.trim()` string input (especially email addresses) before running
  it through a validation regex. Untrimmed input against
  `^[^\s@]+@[^\s@]+\.[^\s@]+$`-style patterns rejects otherwise-valid values
  that have incidental leading/trailing whitespace.
- Validation logic must be extracted into a standalone, exported function
  (e.g. `validateFields`), not left as a closure inside the component. This
  is what makes it independently unit-testable.
- Any interactive toggle button (show/hide password, expand/collapse, etc.)
  must set `aria-pressed` reflecting its current boolean state. A toggle
  without `aria-pressed` is a review-blocking accessibility gap, not a
  style nitpick.
- New form components are not complete without a co-located test file
  covering: empty-field submission, at least one invalid-format case, the
  success path, and the rejected/error path.

## AI Assistant Guidelines

When generating code:

- Follow the existing project structure.
- Use SCSS instead of plain CSS.
- Use kebab-case for all CSS class names.
- Do not rename existing classes unless requested.
- Reuse existing components whenever possible.
- Prefer simple and maintainable solutions.
- Avoid unnecessary dependencies.
- Keep generated code consistent with the current codebase.
- When asked to build a form, write it, then write and run tests before
  considering the task done — do not stop at "it renders and looks right."

## Git Workflow

Use Conventional Commits.

Examples:

- `feat: add hero section`
- `fix: resolve mobile navigation layout`
- `style: update header spacing`
- `refactor: simplify card component`
- `docs: update README`
