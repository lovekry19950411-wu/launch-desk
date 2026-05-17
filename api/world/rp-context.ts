import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const appId = process.env.WORLD_APP_ID || "";
    const rpId = process.env.WORLD_RP_ID || "";
    const action = process.env.WORLD_ACTION_ID || "launch-desk-human";
    const signingKey = process.env.WORLD_RP_SIGNING_KEY || "";
    const environment = process.env.WORLD_ID_ENVIRONMENT || "production";

    if (!rpId || !signingKey) {
      res.status(400).json({ error: "WORLD_RP_ID and WORLD_RP_SIGNING_KEY must be configured." });
      return;
    }

    const { signRequest } = await import("@worldcoin/idkit-core/signing");
    const signature = signRequest({
      signingKeyHex: signingKey,
      action,
      ttl: 300
    });

    res.status(200).json({
      app_id: appId,
      action,
      environment,
      rp_context: {
        rp_id: rpId,
        nonce: signature.nonce,
        created_at: signature.createdAt,
        expires_at: signature.expiresAt,
        signature: signature.sig
      }
    });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unable to create World ID RP context." });
  }
}
