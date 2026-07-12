# CLAUDE.md

## Project Overview
This project is built with React and Vite. The goal is to create a clean, maintainable, and responsive web application while following consistent coding and styling conventions.

## Tech Stack
- React
- Vite
- JavaScript (ES6+)
- SCSS (Sass)
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
userData
handleSubmit
fetchProducts
isLoading
```

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

## Git Workflow
Use Conventional Commits.

Examples:
- `feat: add hero section`
- `fix: resolve mobile navigation layout`
- `style: update header spacing`
- `refactor: simplify card component`
- `docs: update README`
