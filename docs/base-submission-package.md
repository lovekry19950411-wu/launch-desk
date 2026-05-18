# Launch Desk - Base Submission Package

Updated: 2026-05-18

這份只給 BASE 用。不要放 WLD，也不要提 TON。

## Current Status

Launch Desk 已經有一個 Base branch prototype：

Live demo:

https://launch-desk-git-base-miniapp-sheng-pung-wus-projects.vercel.app

GitHub:

https://github.com/lovekry19950411-wu/launch-desk/tree/base-miniapp

Base receiver / builder address:

0xc97785f7EEaBafFDE32436842AD4824cB4141f8b

目前已完成：

- Base tracking meta tag
- Base-compatible app metadata
- Base Builder owner address
- USDC unlock direction
- working Launch Desk demo
- AI workflow runtime UI
- launch readiness / risk / owner / copy output

## Best Application Target

### 1. Base Builder Rewards

這個是現在最適合先送的。

原因：

- Base 官方明確說 prototype / experiment counts
- 不需要等產品很大
- 只要持續 build、公開進度、展示 working demo
- Launch Desk 目前已經有 Base branch 和可操作 demo

申請定位：

> Launch Desk is an early Base app prototype exploring AI workflow execution and USDC unlocks for product launch planning.

不要講得太像大公司 SaaS。要像 builder 正在 ship 一個有用的 onchain AI workflow prototype。

### 2. Base Builder Grants

這個可以準備，但建議 Builder Rewards 送出後再送。

原因：

- Builder Grants 偏 retroactive
- 需要更強的 shipped proof
- 如果有 1-2 筆 USDC unlock / Base interaction / X build log，說服力更高

申請定位：

> A shipped AI workflow prototype on Base, using USDC unlocks and moving toward x402 paid workflow APIs.

## Product Description

Short version:

```text
Launch Desk helps founders and small product teams turn a launch brief into an AI-generated workflow: readiness score, risk analysis, owner checklist, rollout tasks, and launch copy.
```

Base-specific version:

```text
Launch Desk is a Base app prototype for AI workflow execution. The Base version explores USDC unlocks for paid workflow generation and a future path toward x402-powered AI workflow APIs.
```

Human version:

```text
I’m building Launch Desk because many small teams know what they want to launch, but they do not have a clear release plan, risk checklist, or owner assignment. This prototype turns a rough launch idea into an actionable workflow.
```

## What The Demo Shows

The Base demo shows:

1. User opens Launch Desk.
2. User enters or uses a launch brief.
3. The product shows a Base USDC unlock layer.
4. The AI workflow runtime starts.
5. Workflow nodes execute with runtime logs.
6. The output includes readiness score, risks, owners, rollout tasks, and launch copy.

Important:

If payment is not fully tested with a funded wallet yet, say it clearly:

```text
The Base branch includes the USDC unlock flow and receiver configuration. The demo focuses on the full workflow experience, with payment testing continuing as the app moves toward a more complete Base-native flow.
```

## Why Base

Use this wording:

```text
Base is a good fit for Launch Desk because the product is moving toward lightweight, paid AI workflow execution. USDC on Base is simple for small payments, and Base’s x402 direction fits the long-term idea of API-based workflow monetization.
```

More natural version:

```text
I want Launch Desk on Base because Base has a strong builder ecosystem and a clear direction around payments, apps, and AI agents. For this prototype, USDC unlocks are a simple first step. Longer term, x402 could let agents or other apps pay per workflow call.
```

## Base Ecosystem Fit

Launch Desk fits these Base themes:

- AI apps
- agentic payments
- USDC payments
- app distribution
- builder tooling
- API monetization
- productivity tooling

Avoid saying:

- guaranteed grant
- investment return
- token launch
- casino
- yield product
- trading bot

## 90-Day Roadmap

### Milestone 1 - Base App Polish

Goal:

Make the Base demo easier to understand and submit.

Deliverables:

- cleaner Base landing state
- clearer USDC unlock copy
- better demo video
- Base.dev metadata completed

### Milestone 2 - Real Base Payment Proof

Goal:

Show that Launch Desk can use Base-native payment rails.

Deliverables:

- test USDC unlock
- BaseScan transaction proof
- payment status UI
- simple unlock record in the demo flow

### Milestone 3 - x402 Workflow API Prototype

Goal:

Turn Launch Desk from demo dashboard into paid workflow infrastructure.

Deliverables:

- paid `/api/launch/plan` endpoint
- x402 payment requirement
- AI agent can pay USDC and call the workflow
- documentation for developers

## Suggested Ask

For Builder Rewards:

No exact ask usually needed. Focus on build progress.

For Builder Grants:

Suggested amount:

```text
1 ETH to 2 ETH
```

Use of funds:

- Base payment integration
- x402 workflow API prototype
- demo production
- infrastructure / deployment cost
- user testing with founders and builders

## Public Build Post

X / Farcaster draft:

```text
Building Launch Desk on Base.

It turns a rough product launch brief into:
- readiness score
- risk analysis
- owner checklist
- rollout tasks
- launch copy

Current Base branch explores USDC unlocks for AI workflow generation.

Demo:
https://launch-desk-git-base-miniapp-sheng-pung-wus-projects.vercel.app
```

More founder-style version:

```text
Small teams often know what they want to launch, but not how to organize the launch.

I’m building Launch Desk on Base to test AI workflow execution for product launches:

brief -> readiness -> risks -> owners -> rollout -> copy

First Base prototype is live.
```

## Application Answers

### What are you building?

```text
Launch Desk is an AI workflow prototype for product launch planning. It helps founders and small product teams turn a rough launch brief into readiness scoring, risk analysis, owner checklists, rollout tasks, and launch copy.

The Base version explores Base-native USDC unlocks as a simple payment layer for workflow generation, with a longer-term path toward x402 paid workflow APIs.
```

### Who is it for?

```text
Launch Desk is for indie hackers, AI builders, SaaS founders, small product teams, and PMs who need to move from idea to launch execution quickly.
```

### Why build on Base?

```text
Base is a strong fit because Launch Desk is moving toward paid AI workflow execution. USDC on Base is simple and practical for small unlock payments, and the x402 direction fits the long-term API-first version of the product.
```

### What have you shipped?

```text
I shipped a working Launch Desk Base branch with Base metadata, a live Vercel demo, Base receiver configuration, and a USDC unlock direction. The product already demonstrates the core AI workflow runtime and launch planning output.
```

### What will you build next?

```text
Next I want to improve the Base-native flow: clearer wallet/payment UX, payment confirmation, transaction proof, and then an x402-powered paid workflow API that other agents or apps can call.
```

## Final Submission Checklist

Before applying:

- [ ] Base live demo opens
- [ ] GitHub branch opens
- [ ] `base:app_id` exists
- [ ] Base receiver address is correct
- [ ] Base Builder owner address is correct
- [ ] One short Base demo video is ready
- [ ] Public build post is published
- [ ] Base.dev metadata is complete
- [ ] No WLD / TON content mixed into Base application

