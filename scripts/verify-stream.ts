type EventShape = { type: string; [key: string]: unknown };

const apiUrl = process.env.LAUNCH_DESK_API_URL || "http://127.0.0.1:8799/api/plan";

const body = {
  productBrief:
    "Launch Desk is a new planning surface that converts rough product launch ideas into release plans, risks, owner checklists, and launch copy for engineering teams.",
  audience: "Engineering managers, product engineers, and release captains",
  launchDate: "2026-06-18",
  constraints: "Must identify missing launch inputs and avoid overpromising unapproved features.",
  assets: "Draft changelog, demo outline, customer quote, support FAQ stub"
};

async function main() {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.body) throw new Error("No response body was returned.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let sawTool = false;
  let sawDelta = false;
  let sawDone = false;
  const firstEvents: EventShape[] = [];

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      const line = frame.split("\n").find((item) => item.startsWith("data: "));
      if (!line) continue;
      const event = JSON.parse(line.slice(6)) as EventShape;
      if (firstEvents.length < 8) firstEvents.push(event);
      if (event.type === "error") throw new Error(String(event.message));
      if (event.type === "tool_progress") sawTool = true;
      if (event.type === "text_delta" && typeof event.delta === "string" && event.delta.length > 0) sawDelta = true;
      if (event.type === "done") sawDone = true;
      if (sawTool && sawDelta && sawDone) break;
    }

    if (sawTool && sawDelta && sawDone) break;
  }

  if (!sawTool || !sawDelta) {
    throw new Error(`Stream verification failed. sawTool=${sawTool} sawDelta=${sawDelta}. First events: ${JSON.stringify(firstEvents, null, 2)}`);
  }

  console.log(`Verified Launch Desk stream: tool_progress=${sawTool}, text_delta=${sawDelta}, done=${sawDone}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
