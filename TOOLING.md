# Tooling maintenance

Updated October 29, 2026.

Vite 8 and Vitest 5 replace deprecated Create React App. React 19, MUI 9, current Testing Library and Web Vitals are installed. JSX modules use .jsx extensions.

## Setup and verification

Use Node.js 26.13.0 (`nvm use` from the repository root) and npm 12.2.1.

```sh
npm install --global npm@12.2.1
cd dither-it
npm ci
npm test
npm run build
```

npm start serves port 3000; npm run build writes build/, preserving the existing deployment output path.

CI runs on pull requests and pushes. Dependabot checks the package manifests and GitHub Actions weekly, grouping compatible minor/patch updates. Major updates remain separate for review.
