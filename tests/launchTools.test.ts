import { describe, expect, it } from "vitest";
import { checkLaunchReadiness, draftChannelCopy, extractTasksFromBrief, generateOwnerChecklist } from "../agent/tools/launchTools";

describe("launch tool patterns", () => {
  it("extracts prioritized launch tasks from a brief", () => {
    const result = extractTasksFromBrief({
      brief: "Developer API beta with data migration requirements",
      launchDate: "2026-06-18",
      constraints: "Pilot cohort only"
    });

    expect(result.prioritizedTasks[0].priority).toBe("P0");
    expect(result.prioritizedTasks.some((task) => task.task.toLowerCase().includes("api docs"))).toBe(true);
  });

  it("flags missing readiness details", () => {
    const result = checkLaunchReadiness({
      brief: "Short launch idea",
      audience: "Teams",
      launchDate: "soon",
      constraints: "",
      assets: ""
    });

    expect(result.readiness).not.toBe("Likely ready");
    expect(result.missingDetails).toContain("available assets");
  });

  it("creates owner checklists and channel copy", () => {
    const checklist = generateOwnerChecklist({
      tasks: ["Freeze scope", "Publish rollback plan"],
      functions: ["Engineering"]
    });
    const copy = draftChannelCopy({
      brief: "Launch Desk turns ideas into release plans.",
      audience: "engineering teams",
      channels: ["slack", "email"]
    });

    expect(checklist[0].owner).toBe("Engineering");
    expect(copy).toHaveLength(2);
  });
});
