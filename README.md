# Project Setup and Running Guide

## Prerequisites

- **Node.js** (v18 or higher) and **npm** — required to install dependencies and run the project.
- **Sass** and **TypeScript** — installed automatically as dev dependencies via `npm install`.

## Installation

Install all project dependencies:

```bash
npm install
```

This installs Sass and all other required packages listed in `package.json`.

## Running the Project

Compile SCSS and TypeScript, and start the development server with a single command:

```bash
npm run dev
```

### This script automatically:

1. Compiles all .scss files from src/scss/ into dist/css/.

2. Compiles all .ts files from src/js/ into dist/js/.

3. Starts the development server.

Open your browser and go to:

```
http://localhost:7000/src/index.html
```

## Code Quality (Linting)

To check the code for syntax and style errors, run:

```
npm run lint
```

To automatically fix most of the errors, run:

```
npm run lint:fix
```

## Notes

SCSS partials (files starting with `_`) are imported into `main.scss` and compiled together into dist/css/main.css.

To stop the server, press `Ctrl + C`.
