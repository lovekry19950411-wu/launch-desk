# Launch Desk World Miniapp Render Deploy

Use this when Vercel is paused.

## Render settings

- Repo: `https://github.com/lovekry19950411-wu/launch-desk`
- Branch: `world-miniapp`
- Runtime: Node
- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Root directory: empty

## Required environment variables

Use the same values from the World/Vercel setup. Do not commit secrets.

- `MODEL_PROVIDER`
- `DASHSCOPE_API_KEY`
- `DASHSCOPE_BASE_URL`
- `ALIBABA_MODEL`
- `WORLD_APP_ID`
- `WORLD_RP_ID`
- `WORLD_ACTION_ID`
- `WORLD_RP_SIGNING_KEY`
- `WORLD_ID_ENVIRONMENT`
- `VITE_WORLD_APP_ID`
- `VITE_WORLD_ACTION_ID`
- `VITE_WORLD_ID_ENVIRONMENT`
- `VITE_WORLD_PAY_TO`
- `VITE_WORLD_PAY_AMOUNT`
- `VITE_WORLD_PAY_TOKEN`

## After deploy

1. Copy the new Render URL.
2. Put it into the World Developer Portal app URL.
3. Keep the GitHub source URL as:
   `https://github.com/lovekry19950411-wu/launch-desk/tree/world-miniapp`
