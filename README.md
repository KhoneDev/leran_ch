# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv@0.17.0 create --template minimal --types ts --add prettier eslint --install pnpm leran_ch
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## 🚀 Cloudflare Pages Deployment

### 1. ຜ່ານ Cloudflare Dashboard (ແນະນຳ):
- **Framework preset**: `SvelteKit` ຫຼື `None`
- **Build command**: `npm run build`
- **Build output directory**: `build`
- **Environment variables**:
  - `NODE_VERSION`: `22` (ໂຄງການມີ `.node-version` ແລະ `.nvmrc` ຮອງຮັບ Node 22 ແລ້ວ)

### 2. ຜ່ານ Cloudflare Wrangler CLI:
```sh
npm run build
npm run deploy:cf
```

