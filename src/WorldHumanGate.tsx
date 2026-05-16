import { IDKitRequestWidget, orbLegacy, type IDKitResult, type RpContext } from "@worldcoin/idkit";
import { MiniKit } from "@worldcoin/minikit-js";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

type WorldRpResponse = {
  app_id: `app_${string}`;
  action: string;
  environment: "production" | "staging";
  rp_context: RpContext;
};

const appId = import.meta.env.VITE_WORLD_APP_ID as `app_${string}` | undefined;
const actionId = (import.meta.env.VITE_WORLD_ACTION_ID as string | undefined) || "launch-desk-human";
const environment = ((import.meta.env.VITE_WORLD_ID_ENVIRONMENT as string | undefined) || "production") as "production" | "staging";

export function WorldHumanGate() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [rpContext, setRpContext] = useState<RpContext | null>(null);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");

  const isInWorldApp = useMemo(() => {
    try {
      return MiniKit.isInWorldApp();
    } catch {
      return false;
    }
  }, []);

  async function startVerification() {
    if (!appId) {
      setMessage("Missing VITE_WORLD_APP_ID.");
      return;
    }

    setIsPreparing(true);
    setMessage("");

    try {
      const response = await fetch("/api/world/rp-context", { method: "POST" });
      const payload = (await response.json()) as WorldRpResponse | { error?: string };
      if (!response.ok || !("rp_context" in payload)) {
        throw new Error("error" in payload && payload.error ? payload.error : "Unable to prepare World ID request.");
      }

      setRpContext(payload.rp_context);
      setIsOpen(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "World ID request failed.");
    } finally {
      setIsPreparing(false);
    }
  }

  async function handleVerify(result: IDKitResult) {
    const response = await fetch("/api/world/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idkitResponse: result })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(payload.error || "World ID verification failed.");
    }
  }

  return (
    <section className="worldGate" aria-label="World ID human verification">
      <div className="worldGateCopy">
        <span>World Mini App</span>
        <strong>Human verified launch console</strong>
        <p>{isInWorldApp ? "Running inside World App." : "World App ready. Open in World App for native verification."}</p>
      </div>
      <button className={verified ? "worldVerify verified" : "worldVerify"} type="button" onClick={startVerification} disabled={isPreparing || verified || !appId}>
        {verified ? <CheckCircle2 size={17} /> : isPreparing ? <Loader2 className="spin" size={17} /> : <ShieldCheck size={17} />}
        {verified ? "Human verified" : isPreparing ? "Preparing..." : "Verify human"}
      </button>
      {message && <p className="worldGateStatus">{message}</p>}
      {!appId && <p className="worldGateStatus">Set VITE_WORLD_APP_ID before production verification.</p>}

      {appId && rpContext && (
        <IDKitRequestWidget
          open={isOpen}
          onOpenChange={setIsOpen}
          app_id={appId}
          action={actionId}
          rp_context={rpContext}
          allow_legacy_proofs={true}
          preset={orbLegacy({ signal: "launch-desk-demo" })}
          environment={environment}
          handleVerify={handleVerify}
          onSuccess={() => {
            setVerified(true);
            setMessage("World ID proof verified.");
          }}
          onError={(errorCode) => {
            setMessage(`World ID error: ${errorCode}`);
          }}
        />
      )}
    </section>
  );
}
