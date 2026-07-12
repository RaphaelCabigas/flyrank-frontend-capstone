# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Tech Stack

- React
- Vite
- JavaScript (ES6+)
- SCSS (Sass)
- Git
- GitHub

## Coding Conventions

- Write clean, readable, and maintainable code.
- Use meaningful names for variables, functions, and components.
- Keep components and functions small and focused.
- Follow consistent formatting and file organization.
- Use modern JavaScript (ES6+) practices.
- Avoid unnecessary code duplication.
- Write comments only when the logic is not obvious.
- Test changes before committing.
- Use clear and descriptive Git commit messages.

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
