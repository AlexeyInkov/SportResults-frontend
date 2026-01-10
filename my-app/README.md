# my-app

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
</code></pre>

## API Endpoints

### Authentication
- <code>POST /api/auth/login/</code> - Login with credentials
- <code>POST /api/auth/register/</code> - Register new user
- <code>POST /api/auth/logout/</code> - Logout user

### Competition Results
- <code>GET /api/results/?participant=&birth_year=&discipline=&competition=</code> - Get competition results with optional filters:
  - <code>participant</code>: Filter by participant name
 - <code>birth_year</code>: Filter by birth year
  - <code>discipline</code>: Filter by discipline
  - <code>competition</code>: Filter by competition name
- <code>GET /api/results/{id}/</code> - Get comparison data for a specific participant

### Disciplines
- <code>GET /api/disciplines/</code> - Get list of available disciplines

### Protocol Upload
- <code>POST /api/protocols/upload/</code> - Upload competition protocol file (supports CSV, XLS, XLSX)
</code></pre>
```
