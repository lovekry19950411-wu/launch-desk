# Launch Desk World Mini App

This branch wraps Launch Desk with the minimal World Mini App layer:

- MiniKit initialization via `MiniKitProvider`
- World App runtime detection
- World ID / IDKit human verification entry
- Server endpoints for RP context signing and proof verification
- Existing Launch Desk mock runtime remains unchanged

## Required World Developer Portal Values

Create a World Developer Portal app and enable World ID 4.0 / RP registration.

Set these environment variables in Vercel:

```bash
VITE_RUNTIME_MODE=mock
VITE_WORLD_APP_ID=app_xxxxx
VITE_WORLD_ACTION_ID=launch-desk-human
VITE_WORLD_ID_ENVIRONMENT=production

WORLD_APP_ID=app_xxxxx
WORLD_RP_ID=rp_xxxxx
WORLD_ACTION_ID=launch-desk-human
WORLD_RP_SIGNING_KEY=0x...
WORLD_ID_ENVIRONMENT=production
```

`WORLD_RP_SIGNING_KEY` is a server secret. Never expose it in frontend env vars.

If you deploy `world-miniapp` as a Vercel branch preview, add the same variables to
the **Preview** environment too. Branch deployments will not read Production-only
variables.

If a World App store click opens the URL in an external browser, confirm the
Developer Portal app type is **Mini App**, not **External**, and use the mini app
launch URL format when testing manually:

```text
https://world.org/mini-app?app_id=app_xxxxx&path=%2F
```

Do not append `open_out_of_window=true`; that flag intentionally forces the app
to open outside the World App webview.

## Local Run

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

Without World env vars, the app still runs and shows a safe setup state.

## Deploy

Deploy this branch as a separate Vercel project or preview deployment.

Use:

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

The `/api/world/rp-context` and `/api/world/verify` files are Vercel serverless functions.

## Official Docs Checked

- World MiniKit initialization: https://docs.world.org/mini-apps/quick-start/init
- World Mini App migration: https://docs.world.org/mini-apps/migration/web-to-miniapp
- IDKit React verification: https://docs.world.org/world-id/idkit/react
- IDKit v4 verification flow: https://docs.world.org/world-id/idkit/integrate
