import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyWorldProof } from "../../server/worldId";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const result = await verifyWorldProof(req.body?.idkitResponse ?? req.body);
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : "World ID verification failed." });
  }
}
