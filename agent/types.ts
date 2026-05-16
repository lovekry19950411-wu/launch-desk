import { z } from "zod";

export const launchRequestSchema = z.object({
  productBrief: z.string().min(20),
  audience: z.string().min(3),
  launchDate: z.string().min(4),
  constraints: z.string().optional().default(""),
  assets: z.string().optional().default("")
});

export type LaunchRequest = z.infer<typeof launchRequestSchema>;

export function formatLaunchRequest(input: LaunchRequest): string {
  return [
    "Create an actionable release plan from this launch brief.",
    "",
    `Product brief: ${input.productBrief}`,
    `Audience: ${input.audience}`,
    `Launch date: ${input.launchDate}`,
    `Constraints: ${input.constraints || "None provided"}`,
    `Available assets: ${input.assets || "None provided"}`
  ].join("\n");
}
