# Launch Desk Base Mini App

This branch prepares Launch Desk as a Base Mini App / Base.dev submission shell.

## Included

- Hardcoded Base Build tracking meta tag:
  `<meta name="base:app_id" content="6a05cfbc7ce26b40a2802bb0" />`
- Base/Farcaster embed metadata in `index.html`
- Public manifest at `/.well-known/farcaster.json`
- Placeholder Base Mini App assets under `/base`
- Existing Launch Desk mock runtime remains unchanged

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
```

## Local Validation

Run:

```bash
npm run verify:base
```

Expected result:

```text
Base Mini App local validation passed.
```

Warnings are expected until Base.dev generates your `accountAssociation`
signature and you replace `baseBuilder.ownerAddress` with your wallet address.

## Base.dev Verification Steps

1. Deploy the `base-miniapp` branch.
2. Open the deployed URL and confirm it loads.
3. Confirm the manifest is reachable:
   `https://your-base-url/.well-known/farcaster.json`
4. Go to Base.dev / Base Build and verify the app.
5. Use the Base Build account association tool to generate:
   - `accountAssociation.header`
   - `accountAssociation.payload`
   - `accountAssociation.signature`
6. Replace the empty strings in `public/.well-known/farcaster.json`.
7. Replace `baseBuilder.ownerAddress` with the wallet address used for Base Build.
8. Commit, push, and redeploy.

## Current Branch URL Assumption

The manifest currently points to:

```text
https://launch-desk-git-base-miniapp-sheng-pung-wus-projects.vercel.app
```

If Vercel gives a different URL, update the URLs in:

- `index.html`
- `public/.well-known/farcaster.json`

## Official Docs Checked

- Base Mini App manifest: https://docs.base.org/mini-apps/features/manifest
- Base embeds and previews: https://docs.base.org/mini-apps/core-concepts/embeds-and-previews
- Base rewards: https://docs.base.org/mini-apps/growth/rewards
- Base migration to standard web app: https://docs.base.org/mini-apps/core-concepts/manifest
