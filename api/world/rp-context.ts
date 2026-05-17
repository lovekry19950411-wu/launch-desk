import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createWorldRpContext } from "../../server/worldId";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const context = await createWorldRpContext();
    res.status(200).json(context);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unable to create World ID RP context." });
  }
}
