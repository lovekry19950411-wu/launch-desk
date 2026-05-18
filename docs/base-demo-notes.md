# Launch Desk - Base Demo Notes

你好，我正在把 Launch Desk 做成一個 Base app prototype。

這個版本的重點不是做一個大型 SaaS，而是先測試一個比較小但清楚的方向：

> AI workflow execution + USDC unlocks on Base

Launch Desk 的核心功能是把一個產品 launch brief，整理成可以執行的 launch workflow。

目前 demo 會產生：

- launch readiness score
- risk analysis
- owner checklist
- rollout tasks
- release notes
- channel copy

我希望它不是一般 chatbot，而是更像 workflow runtime。使用者可以看到 AI workflow nodes、runtime logs、execution states，感覺像系統正在處理 launch operation。

## Why Base

我選 Base 是因為 Launch Desk 長期方向很適合 Base 的 payments / apps / AI agents 生態。

目前第一步是使用 USDC unlock flow。這是一個很簡單的 monetization model：

> pay USDC -> unlock AI workflow generation

未來如果這個方向成立，我希望把 Launch Desk 變成更 API-first 的產品，讓其他 apps 或 AI agents 可以透過 x402 付費呼叫 launch workflow API。

## Current Demo

Live demo:

https://launch-desk-git-base-miniapp-sheng-pung-wus-projects.vercel.app

GitHub:

https://github.com/lovekry19950411-wu/launch-desk/tree/base-miniapp

Base receiver:

0xc97785f7EEaBafFDE32436842AD4824cB4141f8b

## Current Stage

這還是 early prototype。

目前我已完成：

- Base metadata
- Base tracking meta tag
- Base owner / receiver setup
- USDC unlock direction
- AI workflow runtime demo
- launch planning output

接下來會優先補：

- payment confirmation
- transaction proof
- cleaner wallet flow
- x402 paid workflow API

## What I Want To Learn

我想透過 Base 版本測試幾件事：

1. 小團隊會不會需要 AI launch workflow？
2. USDC unlock 是否適合 AI workflow generation？
3. Launch Desk 是否可以從 dashboard 變成 API-first workflow infrastructure？
4. AI agents 未來是否可以透過 x402 直接付費呼叫這類 workflow？

目前我會先保持 scope 很小，專注在 launch / release / PM execution workflow，不做過大的平台。

