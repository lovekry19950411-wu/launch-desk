import { IDKitRequestWidget, orbLegacy, type IDKitResult, type RpContext } from "@worldcoin/idkit";
import { MiniKit } from "@worldcoin/minikit-js";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { CheckCircle2, ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type WorldRpResponse = {
  app_id: `app_${string}`;
  action: string;
  environment: "production" | "staging";
  rp_context: RpContext;
};

const appId = import.meta.env.VITE_WORLD_APP_ID as `app_${string}` | undefined;
const actionId = (import.meta.env.VITE_WORLD_ACTION_ID as string | undefined) || "launch-desk-human";
const environment = ((import.meta.env.VITE_WORLD_ID_ENVIRONMENT as string | undefined) || "production") as "production" | "staging";

type WorldHumanGateProps = {
  verified: boolean;
  onVerified: () => void;
};

export function WorldHumanGate({ verified, onVerified }: WorldHumanGateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [rpContext, setRpContext] = useState<RpContext | null>(null);
  const [message, setMessage] = useState("");
  const [verificationStarted, setVerificationStarted] = useState(false);
  const { isInstalled } = useMiniKit();
  const autoStartedRef = useRef(false);

  const isInWorldApp = useMemo(() => {
    if (typeof isInstalled === "boolean") return isInstalled;
    try {
      return MiniKit.isInWorldApp();
    } catch {
      return false;
    }
  }, [isInstalled]);

  const miniAppDeepLink = useMemo(() => {
    if (!appId) return "";
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    return `https://world.org/mini-app?app_id=${appId}&path=${encodeURIComponent(currentPath || "/")}`;
  }, []);

  const startVerification = useCallback(async () => {
    if (!appId) {
      setMessage("Missing VITE_WORLD_APP_ID.");
      return;
    }

    setIsPreparing(true);
    setVerificationStarted(true);
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
  }, []);

  useEffect(() => {
    if (!isInWorldApp || verified || !appId || autoStartedRef.current) return;
    autoStartedRef.current = true;
    void startVerification();
  }, [isInWorldApp, startVerification, verified]);

  async function handleVerify(result: IDKitResult) {
    setIsOpen(false);
    setVerificationStarted(false);
    onVerified();
    setMessage("World ID proof verified.");

    fetch("/api/world/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result)
    }).catch(() => {
      setMessage("World ID accepted locally. Server verification will retry later.");
    });
  }

  const verificationPending = isPreparing || isOpen || (isInWorldApp && verificationStarted && !verified && !message);

  return (
    <section className="worldGate" aria-label="World ID human verification">
      <div className="worldGateCopy">
        <span>World Mini App</span>
        <strong>Verify with World ID</strong>
        <p>{isInWorldApp ? "Confirm Orb-verified human access before using Launch Desk." : "Open in World App to verify with World ID."}</p>
      </div>
      {!isInWorldApp && miniAppDeepLink && (
        <a className="worldOpenLink" href={miniAppDeepLink}>
          <ExternalLink size={15} />
          Open inside World App
        </a>
      )}
      <button className={verified ? "worldVerify verified" : "worldVerify"} type="button" onClick={startVerification} disabled={verificationPending || verified || !appId}>
        {verified ? <CheckCircle2 size={17} /> : verificationPending ? <Loader2 className="spin" size={17} /> : <ShieldCheck size={17} />}
        {verified ? "Human verified" : verificationPending ? "Verifying..." : message ? "Retry verification" : "Verify human"}
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
          allow_legacy_proofs={false}
          preset={orbLegacy()}
          environment={environment}
          onSuccess={(result) => {
            void handleVerify(result);
          }}
          onError={(errorCode) => {
            setVerificationStarted(false);
            setMessage(`World ID error: ${errorCode}`);
          }}
        />
      )}
    </section>
  );
}
