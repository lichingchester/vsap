# Contributing to tskr/ui

Thank you for your interest in contributing to the tskr/ui project!

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/lichingchester/tskr-ui/pulls)

## Table of Contents

- [Contributing to tskr/ui](#contributing-to-tskrui)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
  - [\[WIP\]](#wip)
  - [Code Style and Standards \[WIP\]](#code-style-and-standards-wip)
    - [Icons](#icons)
  - [Reporting Bugs \[WIP\]](#reporting-bugs-wip)
  - [Feature Requests \[WIP\]](#feature-requests-wip)
  - [Running Tests \[WIP\]](#running-tests-wip)
  - [Communication \[WIP\]](#communication-wip)
  - [Contact \[WIP\]](#contact-wip)

## Project Overview

tskr/ui is an open-source library featuring animated and practical Vue components designed for website development. Built with VueJS, this project aims to provide developers with a comprehensive set of reusable code blocks.

## Getting Started

### Prerequisites

- Node.js (v22 or higher recommended)
- npm
- Git

## [WIP]

We follow the [Conventional Commits](https://www.conventionalcommits.org/)

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code changes that neither fix bugs nor add features
- `test:` - Adding or modifying tests

## Code Style and Standards [WIP]

- We use ESLint for code linting
- Follow the existing code patterns for components, composables, and other files
- Use TypeScript for type safety
- Follow Vue 3 Composition API patterns
- Use the provided `.vscode` folder settings for consistent development experience
  - This folder is committed to Git to ensure all contributors have the same settings
  - Please do not override these settings in your local environment or include personal settings in pull requests

### Icons

- https://simpleicons.org/?q=vue
- https://lucide.dev/guide/comparison

## Reporting Bugs [WIP]

When reporting bugs, please include:

1. A clear, descriptive title
2. Steps to reproduce the bug
3. Expected behavior
4. Actual behavior
5. Screenshots if applicable
6. Browser and OS information

## Feature Requests [WIP]

Feature requests are welcome! Please provide:

1. A clear, descriptive title
2. Detailed description of the proposed feature
3. Any relevant mockups or examples
4. Explanation of why this feature would be valuable to users

## Running Tests

### Verifying variants run in a real framework (sandboxes)

The site only executes the Vue + Tailwind reference variant. Any port you write
(`react-*`, `vue-css`, `html`) is never run by the site — so before you open a
PR, verify it in the **sandboxes**: three real per-framework Vite apps that run
the ports in their native environment, plus a Playwright smoke pass.

Start with the step-by-step guide: [`sandboxes/GUIDE.md`](./sandboxes/GUIDE.md).

The short version:

```bash
# 1. eyeball your port in a real framework app
cd sandboxes/react   # or vue, or html
npm install
npm run dev          # pick your variant from the switcher (react :4331)

# 2. before you PR, run the headless smoke pass over all three
cd sandboxes/smoke
npm install
npm test
```

`react-next` / `vue-nuxt` variants are out of scope for the sandboxes (they need
a real Next/Nuxt runtime); verify those in a scratch project.

## Communication [WIP]

We use GitHub's features to organize our project communication:

- **Discussions**: For general questions, ideas, and community conversations. Use this for non-bug related topics or when you're not sure where to start.
- **Issues**: For reporting bugs, problems, or suggesting well-defined feature requests. Please use the provided templates when available.
- **Pull Requests**: For submitting code changes. Always link to related issues when applicable.

When participating in any form of communication, please follow our code of conduct and be respectful of other contributors.

## Contact [WIP]

If you have questions about contributing, please [open an issue](https://github.com/lichingchester/tskr-ui/issues) or start a [discussion](https://github.com/lichingchester/tskr-ui/discussions).

Thank you for contributing to make the tskr/ui better for everyone!
