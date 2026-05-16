import "dotenv/config";
import cors from "cors";
import express from "express";
import { Runner } from "@openai/agents";
import { randomUUID } from "node:crypto";
import { createLaunchDeskAgent } from "../agent/launchAgent";
import { formatLaunchRequest, launchRequestSchema } from "../agent/types";
import { createModelProvider, getModelName, getProviderName, isProviderConfigured } from "./provider";
import { getRawTextDelta, getToolProgress, writeSse } from "./stream";
import { createWorldRpContext, getWorldIdConfig, verifyWorldProof } from "./worldId";

const app = express();
const port = Number(process.env.PORT || 8799);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  const provider = getProviderName();
  res.json({
    ok: true,
    app: "Launch Desk",
    provider,
    keyConfigured: isProviderConfigured(provider),
    openaiKeyConfigured: Boolean(process.env.OPENAI_API_KEY),
    dashscopeKeyConfigured: Boolean(process.env.DASHSCOPE_API_KEY),
    model: getModelName(provider)
  });
});

app.get("/api/world/config", (_req, res) => {
  const config = getWorldIdConfig();
  res.json({
    appIdConfigured: Boolean(config.appId),
    rpIdConfigured: Boolean(config.rpId),
    signingKeyConfigured: Boolean(config.signingKey),
    action: config.action,
    environment: config.environment
  });
});

app.post("/api/world/rp-context", (_req, res) => {
  try {
    res.json(createWorldRpContext());
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unable to create World ID RP context." });
  }
});

app.post("/api/world/verify", async (req, res) => {
  try {
    const result = await verifyWorldProof(req.body?.idkitResponse ?? req.body);
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : "World ID verification failed." });
  }
});

app.post("/api/plan", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const provider = getProviderName();
  if (!isProviderConfigured(provider)) {
    writeSse(res, {
      type: "error",
      message:
        provider === "alibaba"
          ? "DASHSCOPE_API_KEY is not configured for the server process."
          : "OPENAI_API_KEY is not configured for the server process."
    });
    res.end();
    return;
  }

  const parsed = launchRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    writeSse(res, { type: "error", message: parsed.error.issues.map((issue) => issue.message).join("; ") });
    res.end();
    return;
  }

  const traceId = `trace_${randomUUID().replaceAll("-", "")}`;
  const input = formatLaunchRequest(parsed.data);

  try {
    const modelProvider = createModelProvider(provider);
    const agent = createLaunchDeskAgent({ provider, model: getModelName(provider) });
    const runner = new Runner({
      modelProvider,
      workflowName: "Launch Desk Plan",
      traceId,
      groupId: "launch-desk-local",
      traceMetadata: { app: "launch-desk", provider }
    });
    const stream = await runner.run(agent, input, {
      stream: true as const,
      maxTurns: 6,
      toolExecution: { maxFunctionToolConcurrency: 2 }
    });

    for await (const event of stream) {
      const toolProgress = getToolProgress(event);
      if (toolProgress) writeSse(res, toolProgress);

      const delta = getRawTextDelta(event);
      if (delta) writeSse(res, { type: "text_delta", delta });
    }

    await stream.completed;
    writeSse(res, { type: "done", traceId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown agent error";
    writeSse(res, { type: "error", message });
  } finally {
    res.end();
  }
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Launch Desk API listening on http://127.0.0.1:${port}`);
});
