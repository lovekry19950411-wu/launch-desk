# Launch Desk World Mini App

This branch wraps Launch Desk with the minimal World Mini App layer:

- MiniKit initialization via `MiniKitProvider`
- World App runtime detection
- World ID / IDKit Orb verification gate
- World Pay WLD unlock flow
- Server endpoints for RP context signing and proof verification
- Existing Launch Desk mock runtime remains unchanged

## Current Submission Status

This branch is ready as a World Mini App prototype submission build.

Verified behavior:

1. User opens the Mini App inside World App.
2. Launch Desk shows a World ID verification gate before the main workflow.
3. The IDKit request uses `preset={orbLegacy()}` and `allow_legacy_proofs={false}` for Orb-level verification.
4. After verification, the app shows a World Pay unlock for `0.1 WLD`.
5. If the wallet has insufficient WLD, World App redirects the user to top up.
6. The workflow remains locked until payment is completed.

Fixed public branch URL:

```text
https://launch-desk-git-world-miniapp-sheng-pung-wus-projects.vercel.app
```

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

VITE_WORLD_PAY_TO=0x_your_public_recipient_wallet
VITE_WORLD_PAY_AMOUNT=0.1
VITE_WORLD_PAY_TOKEN=WLD
```

`WORLD_RP_SIGNING_KEY` is a server secret. Never expose it in frontend env vars.
`VITE_WORLD_PAY_TO` is the public recipient wallet for the World Pay demo
unlock. Do not put a private key in Vercel frontend environment variables.

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

## Current Verification Notes

Latest checked branch alias:

```text
https://launch-desk-git-world-miniapp-sheng-pung-wus-projects.vercel.app
```

If the page or `/api/world/config` returns a Vercel Authentication screen, the
World App cannot reach the mini app or verification API. Disable Deployment
Protection for this branch deployment, or promote the WLD branch to a public
production URL before submitting/testing in World App.

The app code now uses the official universal link format:

```text
https://world.org/mini-app?app_id=app_xxxxx&path=%2F
```

This is different from a normal Vercel URL. Opening the normal Vercel URL in a
desktop browser is expected to behave like a normal website; the Mini App
container only exists when launched through World App / world.org mini app link.

## Payment Unlock Notes

This branch includes a lightweight World Pay unlock after World ID verification:

1. User completes World ID human verification.
2. User pays the configured `VITE_WORLD_PAY_AMOUNT` to `VITE_WORLD_PAY_TO`.
3. The Launch Desk workflow button unlocks for the demo session.

This is intentionally frontend-only for the prototype submission. A production
version should add a server-side payment reference/nonce and verify the
transaction before granting durable access.

## Review / Grant Copy

Short description:

```text
Launch Desk helps teams turn a product launch brief into a structured launch workflow with readiness scoring, risk analysis, owner checklists, and release copy.
```

Update log:

```text
This update adds World ID verification, World Pay WLD unlock, and an AI launch workflow runtime demo. Users verify with World ID, unlock the workflow with 0.1 WLD, then generate launch readiness, risk analysis, owner checklist, and release copy.
```

Support contact:

```text
lovekry19950411@gmail.com
```

Positioning:

```text
Launch Desk is an AI workflow tool for product launches. It uses World ID to verify human access and World Pay to unlock a small workflow demo inside World App.
```

Avoid these words in submission copy:

```text
official, guaranteed, grant guaranteed, investment, yield, token presale, beta, casino, raffle, lottery
```

## Public Proof Links

Use these links when a grant, review, or public-goods profile asks for proof of
work or public project tracking:

```text
World App demo:
https://launch-desk-git-world-miniapp-sheng-pung-wus-projects.vercel.app

GitHub source:
https://github.com/lovekry19950411-wu/launch-desk/tree/world-miniapp

Giveth public project:
https://giveth.io/project/launch-desk
```

## Official Docs Checked

- World MiniKit initialization: https://docs.world.org/mini-apps/quick-start/init
- World Mini App migration: https://docs.world.org/mini-apps/migration/web-to-miniapp
- IDKit React verification: https://docs.world.org/world-id/idkit/react
- IDKit v4 verification flow: https://docs.world.org/world-id/idkit/integrate
- World Pay command: https://docs.world.org/mini-apps/commands/pay
- World Mini App review guidelines: https://docs.world.org/mini-apps/guidelines/policy
- World Mini App guidelines: https://docs.world.org/mini-apps/guidelines/app-guidelines
