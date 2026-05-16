import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createWorldRpContext } from "../../server/worldId";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    res.status(200).json(createWorldRpContext());
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unable to create World ID RP context." });
  }
}
