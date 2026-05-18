# Launch Desk Base App Submission

This branch prepares Launch Desk as a Base App / Base.dev submission shell.
It intentionally stays separate from `world-miniapp`.

## Included

- Hardcoded Base Build tracking meta tag:
  `<meta name="base:app_id" content="6a05cfbc7ce26b40a2802bb0" />`
- Open Graph metadata in `index.html`
- Base/Farcaster compatibility embed metadata in `index.html`
- Public compatibility manifest at `/.well-known/farcaster.json`
- Placeholder Base App assets under `/base`
- Existing Launch Desk mock runtime remains unchanged
- Base USDC unlock layer using the injected Base/Coinbase wallet provider

## Official Direction Checked

Base documentation says that after April 9, 2026 the Base App treats apps as
standard web apps plus wallet, powered by Base.dev metadata. This branch follows
that direction first. It does not copy the World ID / World Pay logic from WLD.

Current target:

```text
standard web app + Base tracking meta + Base.dev metadata readiness
```

Current Base-specific addition:

```text
connect wallet -> switch to Base -> transfer USDC -> unlock Launch Desk generation
```

The branch uses native EIP-1193 wallet calls and the official Base USDC contract
on Base mainnet. This keeps the demo lightweight while still being Base-native.

Future Base-specific additions:

```text
SIWE auth if needed
Paymaster / gasless action
MiniKit / OnchainKit provider wrapper if Base.dev requires deeper in-app hooks
x402 paid API route if Launch Desk becomes API-first paid infrastructure
```

These are intentionally not added yet so WLD remains isolated and the Base branch
stays easy to review.

## Funding Fit

Best first target:

```text
Base Builder Rewards
```

Why:

- Official docs say prototypes and experiments are welcome.
- Progress sharing matters.
- No minimum project size is required.

Second target after this branch is live:

```text
Base Builder Grants
```

Why:

- Official docs describe grants as retroactive for shipped projects.
- Range is listed as roughly 1-5 ETH.
- A working deployed demo is better than a long pitch.

Optional later target:

```text
Paymaster Gas Credits
```

Use this when Launch Desk adds a gasless save/mint/unlock action on Base.

## Deploy

Deploy this branch as a separate Vercel project or branch deployment.

Use:

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

Add:

```text
VITE_RUNTIME_MODE=mock
VITE_BASE_USDC_AMOUNT=1
VITE_BASE_USDC_RECEIVER=your_public_base_wallet_address
```

`VITE_BASE_USDC_RECEIVER` is a public receiving address. Do not paste private
keys into Vercel.

## Local Validation

Run:

```bash
npm run verify:base
```

Expected result:

```text
Base standard web app local validation passed.
```

Warnings are expected until you replace `baseBuilder.ownerAddress` with your
Base Build wallet address. `accountAssociation` is kept only for compatibility
with legacy embed validation and can be filled later if Base.dev asks for it.

## Base.dev Verification Steps

1. Deploy the `base-miniapp` branch.
2. Open the deployed URL and confirm it loads.
3. Create or update the project on Base.dev.
4. Fill in Base.dev metadata:
   - Name: `Launch Desk`
   - Tagline: `AI launch workflow for product teams`
   - Category: `Productivity`
   - Primary URL: the Vercel branch URL
   - Icon: `/base/icon.png`
   - Hero image: `/base/hero.png`
   - Screenshots: `/base/screenshot-1.png`, `/base/screenshot-2.png`, `/base/screenshot-3.png`
   - Support email: `lovekry19950411@gmail.com`
5. Add or confirm the Builder Code / owner wallet in Base.dev.
6. Add Vercel env vars:
   - `VITE_RUNTIME_MODE=mock`
   - `VITE_BASE_USDC_AMOUNT=1`
   - `VITE_BASE_USDC_RECEIVER=<your public Base wallet>`
7. Confirm the compatibility manifest is reachable:
   `https://your-base-url/.well-known/farcaster.json`
8. If Base.dev asks for legacy account association, use the account association tool to generate:
   - `accountAssociation.header`
   - `accountAssociation.payload`
   - `accountAssociation.signature`
9. Replace the empty strings in `public/.well-known/farcaster.json`.
10. Replace `baseBuilder.ownerAddress` with the wallet address used for Base Build.
11. Commit, push, and redeploy.

## Submission Copy

Short description:

```text
Launch Desk helps founders and product teams turn a launch brief into an AI-generated release workflow with readiness scoring, risk analysis, owner checklists, and release copy.
```

Builder Rewards post:

```text
Built Launch Desk on Base: an AI workflow tool for product launch planning. It turns a brief into readiness score, risks, rollout tasks, owners, and launch copy. First Base branch is live as a standard web app with Base.dev metadata readiness.
```

Builder Grants angle:

```text
Launch Desk is a shipped AI workflow prototype for startup launch operations. The Base version is prepared as a standard web app for Base App distribution, with a path toward wallet-based workflows, gasless actions, and Base-native unlocks.
```

Payment wording:

```text
Launch Desk uses Base-native USDC unlocks for paid workflow generation. The first version is intentionally simple: connect wallet, pay USDC on Base, then run the launch workflow demo.
```

Avoid:

```text
official, guaranteed grant, investment return, yield, token presale, casino, raffle, lottery
```

## Current Branch URL Assumption

The manifest currently points to:

```text
https://launch-desk-git-base-miniapp-sheng-pung-wus-projects.vercel.app
```

If Vercel gives a different URL, update the URLs in:

- `index.html`
- `public/.well-known/farcaster.json`

## Official Docs Checked

- Base funding: https://docs.base.org/get-started/get-funded
- Base Mini Apps: https://docs.base.org/mini-apps/quickstart/create-new-miniapp
- Base standard web app migration: https://docs.base.org/mini-apps/quickstart/migrate-to-standard-web-app
- Base Mini Apps overview: https://www.base.org/build/mini-apps
