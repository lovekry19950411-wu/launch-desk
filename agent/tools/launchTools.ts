import { tool } from "@openai/agents";
import { z } from "zod";

const taskInput = z.object({
  brief: z.string(),
  launchDate: z.string(),
  constraints: z.string().optional()
});

const readinessInput = z.object({
  brief: z.string(),
  audience: z.string(),
  launchDate: z.string(),
  constraints: z.string().optional(),
  assets: z.string().optional()
});

const checklistInput = z.object({
  tasks: z.array(z.string()).min(1),
  functions: z.array(z.string()).optional()
});

const copyInput = z.object({
  brief: z.string(),
  audience: z.string(),
  channels: z.array(z.enum(["email", "slack", "blog", "social", "in_app"]))
});

export function extractTasksFromBrief(input: z.infer<typeof taskInput>) {
  const source = `${input.brief} ${input.constraints ?? ""}`.toLowerCase();
  const tasks = [
    "Confirm launch scope, success metric, and no-go criteria",
    "Freeze release candidate and publish rollback plan",
    "Prepare customer-facing copy and support enablement",
    "Run stakeholder review for product, engineering, support, and marketing",
    "Schedule launch-day monitoring and decision checkpoints"
  ];

  if (source.includes("beta") || source.includes("pilot")) {
    tasks.unshift("Define beta cohort, feedback channels, and expansion criteria");
  }
  if (source.includes("migration") || source.includes("data")) {
    tasks.splice(1, 0, "Validate migration dry run, backups, and data quality checks");
  }
  if (source.includes("api") || source.includes("developer")) {
    tasks.push("Publish API docs, changelog, SDK examples, and developer support rota");
  }

  return {
    launchDate: input.launchDate,
    prioritizedTasks: tasks.map((task, index) => ({
      id: `T${index + 1}`,
      priority: index < 3 ? "P0" : index < 6 ? "P1" : "P2",
      task
    }))
  };
}

export function checkLaunchReadiness(input: z.infer<typeof readinessInput>) {
  const missing: string[] = [];
  if (input.brief.length < 80) missing.push("product scope and launch promise");
  if (!input.assets?.trim()) missing.push("available assets");
  if (!input.constraints?.trim()) missing.push("constraints or non-goals");
  if (!/\d/.test(input.launchDate)) missing.push("specific launch date");

  const riskScore = Math.min(100, 35 + missing.length * 15 + (input.brief.length < 140 ? 10 : 0));
  return {
    readiness: riskScore >= 75 ? "At risk" : riskScore >= 55 ? "Needs review" : "Likely ready",
    score: 100 - riskScore,
    rubric: [
      { area: "Scope clarity", status: input.brief.length >= 80 ? "pass" : "watch" },
      { area: "Audience fit", status: input.audience.length >= 8 ? "pass" : "watch" },
      { area: "Timeline", status: /\d/.test(input.launchDate) ? "pass" : "blocker" },
      { area: "Assets", status: input.assets?.trim() ? "pass" : "watch" },
      { area: "Constraints", status: input.constraints?.trim() ? "pass" : "watch" }
    ],
    missingDetails: missing,
    topRisks: [
      "Launch promise may drift without crisp success and no-go criteria",
      "Support and comms readiness can lag engineering completion",
      "Monitoring ownership may be unclear during the first 24 hours"
    ]
  };
}

export function generateOwnerChecklist(input: z.infer<typeof checklistInput>) {
  const owners = input.functions?.length ? input.functions : ["Engineering", "Product", "Marketing", "Support"];
  return owners.map((owner, index) => ({
    owner,
    checklist: input.tasks.slice(0, 5).map((task, taskIndex) => ({
      due: taskIndex < 2 ? "T-10 days" : taskIndex < 4 ? "T-5 days" : "Launch day",
      item: `${owner}: ${task}`,
      ownerHint: `${owner.toLowerCase()}-${index + 1}`
    }))
  }));
}

export function draftChannelCopy(input: z.infer<typeof copyInput>) {
  const oneLine = input.brief.split(/[.!?]/)[0]?.trim() || "New product launch";
  return input.channels.map((channel) => ({
    channel,
    draft:
      channel === "slack"
        ? `Heads up: ${oneLine}. We are preparing this for ${input.audience}; reply with blockers or customer concerns before launch review.`
        : channel === "email"
          ? `Subject: Introducing ${oneLine}\n\nWe built this for ${input.audience}. Here is what changes, why it matters, and how to get started.`
          : channel === "blog"
            ? `${oneLine}\n\nToday we are sharing the launch story, the customer problem, what is available now, and what comes next.`
            : channel === "in_app"
              ? `New: ${oneLine}. See what changed and start using it today.`
              : `${oneLine} is launching for ${input.audience}. More details soon.`
  }));
}

export const launchTools = [
  tool({
    name: "extract_tasks_from_brief",
    description: "Extract prioritized engineering, launch, and enablement tasks from a product launch brief.",
    parameters: taskInput,
    execute: extractTasksFromBrief
  }),
  tool({
    name: "check_launch_readiness",
    description: "Score launch readiness against a practical release rubric and identify missing details or risks.",
    parameters: readinessInput,
    execute: checkLaunchReadiness
  }),
  tool({
    name: "generate_owner_checklist",
    description: "Generate owner-specific launch checklists from prioritized tasks.",
    parameters: checklistInput,
    execute: generateOwnerChecklist
  }),
  tool({
    name: "draft_channel_copy",
    description: "Draft channel-specific launch copy for email, Slack, blog, social, and in-app announcements.",
    parameters: copyInput,
    execute: draftChannelCopy
  })
];
