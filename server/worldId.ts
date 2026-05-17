import { signRequest } from "@worldcoin/idkit-core/signing";

const WORLD_VERIFY_BASE_URL = "https://developer.world.org/api/v4/verify";

export function getWorldIdConfig() {
  return {
    appId: process.env.WORLD_APP_ID || "",
    rpId: process.env.WORLD_RP_ID || "",
    action: process.env.WORLD_ACTION_ID || "launch-desk-human",
    signingKey: process.env.WORLD_RP_SIGNING_KEY || "",
    environment: process.env.WORLD_ID_ENVIRONMENT || "production"
  };
}

export function createWorldRpContext() {
  const config = getWorldIdConfig();
  if (!config.rpId || !config.signingKey) {
    throw new Error("WORLD_RP_ID and WORLD_RP_SIGNING_KEY must be configured.");
  }

  const signature = signRequest({
    signingKeyHex: config.signingKey,
    action: config.action,
    ttl: 300
  });

  return {
    app_id: config.appId,
    action: config.action,
    environment: config.environment,
    rp_context: {
      rp_id: config.rpId,
      nonce: signature.nonce,
      created_at: signature.createdAt,
      expires_at: signature.expiresAt,
      signature: signature.sig
    }
  };
}

export async function verifyWorldProof(idkitResponse: unknown) {
  const config = getWorldIdConfig();
  if (!config.rpId) {
    throw new Error("WORLD_RP_ID must be configured.");
  }

  const response = await fetch(`${WORLD_VERIFY_BASE_URL}/${config.rpId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "LaunchDeskWorldMiniApp/1.0"
    },
    body: JSON.stringify(idkitResponse)
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof payload?.message === "string" ? payload.message : "World ID proof verification failed.";
    throw new Error(message);
  }

  return payload;
}
