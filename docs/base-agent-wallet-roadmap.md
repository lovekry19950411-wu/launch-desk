# Launch Desk - Base Agent Wallet Roadmap

This is the no-gas roadmap for the Base AI agents direction.

## Current Position

Launch Desk should not force a smart contract before the product has revenue.

The better Base path is:

```text
AI workflow runtime
-> Base Builder Code attribution
-> dedicated agent wallet
-> x402 paid workflow API
-> smart contract only when needed
```

## Current Builder Code

```text
bc_9jnnvjew
```

Use this when Base asks for:

```text
Builder Code
Generator Code
Builder referral code
Agent Builder Code
```

## Why This Fits Base

Base documentation has a dedicated AI Agents direction:

- Agent wallets
- Builder Codes
- x402 payments
- USDC payments
- Sign messages
- Pay for APIs and services
- Accept payments for agent endpoints

This fits Launch Desk better than deploying a smart contract too early.

## No-Cost Steps

These can be done before spending gas:

1. Register and keep the Builder Code.
2. Document Launch Desk as an AI workflow agent API direction.
3. Prepare an agent wallet plan.
4. Prepare x402 endpoint names.
5. Keep the app live as a Base demo.

## Future Paid / Onchain Steps

Only do these later:

1. Fund an agent wallet.
2. Test one USDC payment.
3. Add ERC-8021 `dataSuffix` attribution to real transactions.
4. Add x402 payment middleware.
5. Deploy smart contracts only if a grant or product flow truly requires it.

## Agent Wallet Options

### CDP Agentic Wallet

Best fit for Coinbase / Base ecosystem alignment.

Use later when ready:

```text
CDP Agentic Wallet
Base network
x402 payments
USDC send / receive
```

### Bankr

Good for agents with sponsored gas and trading features.

Use later only if Launch Desk needs swaps or trading-like actions.

### Sponge Wallet

Good for x402 automation and multi-chain agent payments.

Use later if Launch Desk becomes a paid workflow API consumed by other agents.

## x402 API Direction

Future paid endpoints:

```text
POST /api/launch/plan
POST /api/launch/readiness
POST /api/launch/copy
```

The first monetizable API should be:

```text
POST /api/launch/plan
```

Reason:

- Easy to understand
- Useful for founders
- Clear output
- Good fit for pay-per-call

## Application Wording

Use this in Base applications:

```text
Launch Desk is moving toward an AI agent workflow API on Base. The current prototype demonstrates the workflow runtime and Base USDC unlock direction. The next milestone is to connect Builder Code attribution, prepare a dedicated agent wallet, and explore x402-paid workflow APIs so other agents can pay per launch workflow request.
```

Avoid saying:

```text
deployed smart contract
fully onchain protocol
guaranteed rewards
investment return
```

unless those are actually true later.
