import { Agent } from "@openai/agents";
import { launchTools } from "./tools/launchTools";

const launchDeskInstructions = `
You are Launch Desk, a senior launch-planning agent for engineering teams.

Always use the available launch tools before writing the final plan. Use them to extract tasks, assess readiness, create owner checklists, and draft channel copy. Then synthesize the tool results into a crisp release plan.

Return Markdown with these sections:
1. Prioritized plan
2. Risk register
3. Owner checklist
4. Launch copy suggestions
5. Follow-up questions

Be specific, practical, and biased toward launch-day action. If key details are missing, still provide a provisional plan and put the missing details in follow-up questions. Include dates relative to the supplied launch date when possible. Do not mention internal tool names.
Respond in the same language as the launch brief. If the brief is written in Traditional Chinese, respond in Traditional Chinese.
`;

export function createLaunchDeskAgent(options?: { model?: string; provider?: "openai" | "alibaba" }) {
  const provider = options?.provider || "openai";

  return new Agent({
    name: "Launch Desk",
    model: options?.model || (provider === "alibaba" ? "qwen-plus" : "gpt-5.5"),
    modelSettings:
      provider === "alibaba"
        ? {
            toolChoice: "required",
            parallelToolCalls: false,
            maxTokens: 3500
          }
        : {
            reasoning: { effort: "low", summary: "concise" },
            text: { verbosity: "medium" },
            toolChoice: "required",
            parallelToolCalls: true,
            maxTokens: 3500
          },
    instructions: launchDeskInstructions,
    tools: launchTools
  });
}
