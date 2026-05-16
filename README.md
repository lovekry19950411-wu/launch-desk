# Launch Desk

Launch Desk is a working launch-planning agent app for engineering teams. The frontend collects a product brief, audience, launch date, constraints, and available assets, then streams a plan from an Agents SDK server.

The agent returns:

- Prioritized release plan
- Risk register
- Owner checklist
- Channel-specific launch copy
- Follow-up questions when important details are missing

## Stack

- React + Vite frontend
- Express API server with Server-Sent Events
- `@openai/agents` JavaScript/TypeScript SDK
- Local function tools for task extraction, readiness scoring, owner checklists, and launch copy
- Agents SDK tracing metadata through `Runner` run configuration

The implementation uses the current Agents SDK streaming pattern: `run(agent, input, { stream: true })`, and listens for raw model text deltas plus run item tool events. Model guidance was checked against the OpenAI models page, which currently recommends `gpt-5.5` for complex professional work and lower-cost variants such as `gpt-5.4-mini` for latency/cost-sensitive use. The server can also use Alibaba Cloud Model Studio / DashScope through its OpenAI-compatible Chat Completions endpoint.

## Setup

```bash
npm install
copy .env.example .env
```

Edit `.env` for Alibaba Cloud Model Studio / DashScope:

```bash
MODEL_PROVIDER=alibaba
DASHSCOPE_API_KEY=sk-your-dashscope-key
DASHSCOPE_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
ALIBABA_MODEL=qwen-plus
PORT=8799
```

For China Beijing region, use:

```bash
DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

For US Virginia region, use:

```bash
DASHSCOPE_BASE_URL=https://dashscope-us.aliyuncs.com/compatible-mode/v1
```

OpenAI is still supported:

```bash
MODEL_PROVIDER=openai
OPENAI_API_KEY=sk-proj-your-key
OPENAI_MODEL=gpt-5.5
PORT=8799
```

Run both servers:

```bash
npm run dev
```

Open the frontend:

```text
http://127.0.0.1:5173
```

The API runs at:

```text
http://127.0.0.1:8799
```

## Verify the real agent stream

With both servers running and the selected provider key set in the API server process:

```bash
npm run verify:e2e
```

This posts to `/api/plan` and reads the SSE stream until it sees:

- at least one `tool_progress` event
- at least one `text_delta` event
- a final `done` event when available

This is intentionally stronger than checking Vite startup or `/api/health`.

## Project Structure

```text
agent/
  launchAgent.ts              Agent instructions, model, tool registration
  types.ts                    Request schema and prompt formatting
  tools/launchTools.ts        Extensible launch-planning tool patterns
server/
  index.ts                    Express API and SSE route
  stream.ts                   Stream event normalization
src/
  App.tsx                     Polished frontend flow
  styles.css                  Responsive UI
tests/
  launchTools.test.ts         Tool behavior tests
scripts/
  verify-stream.ts            End-to-end streamed API verifier
```

## Extending

Add a new tool in `agent/tools/launchTools.ts`, export it in `launchTools`, then update the agent instructions in `agent/launchAgent.ts` so the model knows when to use it. For larger workflows, add specialist agents and expose them via `agent.asTool(...)` or handoffs.

## Validation Checklist

- Frontend accepts product brief, audience, launch date, constraints, and assets.
- Frontend progressively shows tool progress and streamed model output.
- API validates request shape before starting an agent run.
- Agent uses function tools before final synthesis.
- Tool outputs include prioritized tasks, readiness rubric, owner checklists, and channel copy.
- Missing details appear as follow-up questions rather than blocking all output.
- `npm test` passes.
- `npm run verify:e2e` confirms a real streamed tool event and model text delta with the selected provider key configured.
