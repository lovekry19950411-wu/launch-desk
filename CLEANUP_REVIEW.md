# Launch Desk Cleanup Review

更新時間：2026-05-17

這份文件只是盤點，不代表已刪除任何東西。請先確認後再處理。

## 目前最重要的專案

| 類型 | 名稱 | 建議 |
| --- | --- | --- |
| GitHub / Vercel | `launch-desk` | 保留。這是目前主線，包含 `main`、`world-miniapp`、`base-miniapp`。 |
| Branch | `world-miniapp` | 保留。WLD 送審用，但 World ID 驗證流程仍需要實機再測。 |
| Branch | `base-miniapp` | 保留。Base Mini App 雛形已推上去，剩 Base.dev 錢包簽名與 owner address 要你本人確認。 |

## Launch Desk 目前部署線索

| 分支 | 用途 | Vercel branch alias |
| --- | --- | --- |
| `main` | 原始產品 demo / X 分享版 | `launch-desk-git-main-sheng-pung-wus-projects.vercel.app` |
| `world-miniapp` | World Mini App / World ID 驗證版 | `launch-desk-git-world-miniapp-sheng-pung-wus-projects.vercel.app` |
| `base-miniapp` | Base Mini App / Farcaster metadata 版 | `launch-desk-git-base-miniapp-sheng-pung-wus-projects.vercel.app` |

## Base 版剩下你本人要確認的地方

- `public/.well-known/farcaster.json`
  - `accountAssociation`：需要 Base.dev / Farcaster 錢包簽名。
  - `baseBuilder.ownerAddress`：需要填你的 Base Build 錢包地址。
- 本地驗證目前通過：
  - `npm.cmd run verify:base`
  - `npm.cmd run build`
  - `npm.cmd test`

## WLD 版目前問題記錄

- 已移除自動跳轉 loop。
- 已保留 World ID gate。
- 目前你實測仍會「跳出去、回來、再出去」，最後像一般外部網頁。
- 下一步應優先確認：
  - World Developer Portal 是否選「小程式 / Mini App」，不是「外部」。
  - World store 開啟網址是否使用 mini app 入口，而不是一般 Vercel URL。
  - Vercel env 是否同時存在 Production / Preview。
  - `/api/world/rp-context` 是否能在部署環境正常回傳。

## Vercel 專案盤點

### 建議保留

| 專案 | 原因 |
| --- | --- |
| `launch-desk` | 目前主線，WLD/Base 都在這個 repo 分支內。 |
| `world-mini-app-nexus` | 可能含 WLD mini app 經驗，可當參考。 |
| `world-rebirth-portal` | WLD 相關，先保留到 WLD 驗證流程穩定。 |
| `onchain-agent` | Base / onchain agent 方向可能有用。 |
| `cdp-sdk-spwu` | Coinbase CDP / Base 方向可能有用。 |
| `aa-smart-wallet-demo` | Smart wallet 方向可能有用。 |
| `smart-wallet` | Smart wallet 方向可能有用。 |
| `smart-wallet-3xut` | Smart wallet 方向可能有用，需和 `smart-wallet` 比對。 |

### 可列入刪除候選，但要你確認

| 專案 | 理由 |
| --- | --- |
| `started-with-upstash-redis-and-next-js` | 看起來像樣板教學專案。 |
| `get-started-with-upstash-redis-and-next-js` | 和上一個高度重複。 |
| `statsig-flags-sdk-example` | 看起來像範例專案。 |
| `vercel-ai-demo` | 看起來像早期 demo。 |
| `nextjs` | 名稱過於通用，可能是樣板。 |
| `onboarding-demo` | 看起來像 demo。 |
| `onboarding-guide` | 看起來像 demo / guide。 |
| `v0-mini-app-clone` | 看起來像 clone/demo。 |

### 需要你判斷內容價值

| 專案 | 理由 |
| --- | --- |
| `ai-content-factory-one-click-web2-to-web3-content-monetization-agent` | 可能是舊產品想法，名稱完整，先不要刪。 |
| `ai-content-factory-google-mini` | 可能可回收為內容工廠 demo。 |
| `mindsync-ai-v4` | 名稱像獨立產品，需看用途。 |
| `knowledge-agent` | 可能可重用 agent 架構。 |
| `vibe-coding-p` | 內容未知。 |
| `tw_spwu_zh` | 內容未知，可能是個人/語系專案。 |
| `my-first-mini-app` | 可能已被 Launch Desk 取代，但先確認。 |

## GitHub 倉庫盤點

### 建議保留

- `lovekry19950411-wu/launch-desk`
- `lovekry19950411-wu/world-mini-app-nexus`
- `lovekry19950411-wu/world-rebirth-portal`
- `lovekry19950411-wu/skills-bankr-base-ai`
- `lovekry19950411-wu/gmini-base-a`
- `lovekry19950411-wu/AI-WLD-ID-MINI-APP`

### 可列入刪除或封存候選，但要你確認

- `lovekry19950411-wu/statsig-flags-sdk-example`
- `lovekry19950411-wu/started-with-upstash-redis-and-next-js`
- `lovekry19950411-wu/get-started-with-upstash-redis-and-next-js`
- `lovekry19950411-wu/nextjs-ai-chatbot`
- `lovekry19950411-wu/chatbot`

### 需要你判斷

- `lovekry19950411-wu/knowledge-agent`
- `lovekry19950411-wu/vibe-coding-p`
- `lovekry19950411-wu/mindsync-ai-v4`
- `lovekry19950411-wu/AI-Content-Factory-One-Click-Web2-to-Web3-Content-Monetization-Agent`
- `lovekry19950411-wu/AI-Content-Factory-google-mini`
- `lovekry19950411-wu/my-first-mini-app`

## 本地資料夾盤點

### 目前 Codex 工作區

| 路徑 | 建議 |
| --- | --- |
| `C:\Users\lovek\Documents\Codex\2026-05-16\build-a-working-launch-planning-agent` | 保留。這是 Launch Desk 本地專案。 |
| `node_modules` | 可重裝，未來若要省空間可刪，但不是現在。 |
| `dist` | build 產物，可重建，未來可刪。 |
| `.env` | 保留在本地，不能上傳。 |

### D 槽疑似專案資料夾

#### 建議保留到 Base/WLD 送審完成

- `D:\new-base-king-ai`
- `D:\my-first-mini-app-clean`
- `D:\worldcoin-mini`
- `D:\BASE`
- `D:\world-mini-app-nexus-main`
- `D:\world-new`
- `D:\world-official`
- `D:\worid-app`
- `D:\smart-wallet-main-main`
- `D:\my-web-wallet`

#### 可列入清理候選，但要你確認

- `D:\vercel-cli`
- `D:\eruda`
- `D:\OpenClawApp`
- `D:\openclow`
- `D:\cursor'`
- `D:\export`
- `D:\sos`
- `D:\lproy`
- `D:\earnapp`
- `D:\pawns.app`
- `D:\Honeygain`

#### 系統或工具資料夾，不建議我碰

- `D:\Windows`
- `D:\Docker`
- `D:\Git`
- `D:\PHP`
- `D:\WPS`
- `D:\Telegram-電報`
- `D:\System Volume Information`
- `D:\$RECYCLE.BIN`
- `D:\.pnpm-store`
- `D:\.config`
- `D:\.DICloakCache`
- `D:\Config.Msi`

## Downloads 可清理候選

這些看起來像影片、Loom、壓縮檔，可能可以移到備份或刪除，但請先確認：

- `Video Project 2.mp4`
- `Loom Message - 16 May 2026 (1).mp4`
- `Loom Message - 16 May 2026.mp4`
- `AI-Content-Factory-google-mini.7z`
- `Video Project 1.mp4`
- `Loom Message - 9 May 2026.mp4`
- `world-mini-app-nexus.zip`
- 多個 `iloveimg-compressed*.zip`

## 建議下一步

1. 先完成 WLD 送審測試，不急著刪 World 相關舊案。
2. Base 送審前，先補 `farcaster.json` 的 wallet signature 和 owner address。
3. 你回來後，先從「可列入刪除候選」挑 3-5 個確認，我再幫你產生安全刪除/封存步驟。
4. 對 GitHub / Vercel 建議先用「archive / unlink deployment」優先，不要一開始永久刪除。
