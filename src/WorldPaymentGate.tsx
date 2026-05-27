import { MiniKit } from "@worldcoin/minikit-js";
import { Network, Tokens, tokenToDecimals, type PayResult } from "@worldcoin/minikit-js/commands";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";

const payTo = import.meta.env.VITE_WORLD_PAY_TO as string | undefined;
const payAmount = Number(import.meta.env.VITE_WORLD_PAY_AMOUNT || "0.5");
const payToken = ((import.meta.env.VITE_WORLD_PAY_TOKEN as string | undefined) || Tokens.WLD) as Tokens;
const PAY_TIMEOUT_MS = 45000;

type WorldPaymentGateProps = {
  verified: boolean;
  unlocked: boolean;
  onUnlocked: () => void;
};

export function WorldPaymentGate({ verified, unlocked, onUnlocked }: WorldPaymentGateProps) {
  const [isPaying, setIsPaying] = useState(false);
  const [message, setMessage] = useState("");
  const paymentConfigured = Boolean(payTo);

  async function unlockWithPayment() {
    if (!verified || unlocked || !paymentConfigured || isPaying) return;

    setIsPaying(true);
    setMessage("Opening World Pay. Confirm the payment in World App.");

    try {
      const recipient = payTo;
      if (!recipient) {
        setMessage("Payment recipient is not configured yet.");
        return;
      }

      if (!MiniKit.isInstalled()) {
        setMessage("Open this Mini App in World App to use World Pay.");
        return;
      }

      const reference = createPaymentReference();
      const result = await withTimeout(
        MiniKit.pay({
          reference,
          to: recipient,
          tokens: [
            {
              symbol: payToken,
              token_amount: tokenToDecimals(payAmount, payToken).toString()
            }
          ],
          description: `Launch Desk workflow unlock - ${payAmount} ${payToken}`,
          network: Network.WorldChain,
          fallback: async () => ({ transactionId: "", reference, from: "", chain: Network.WorldChain, timestamp: "" })
        }),
        PAY_TIMEOUT_MS
      );

      const payment = result.data as PayResult | undefined;
      if (result.executedWith === "minikit" && payment?.transactionId) {
        onUnlocked();
        setMessage(`Payment submitted. Reference: ${payment.reference}`);
        return;
      }

      setMessage("World Pay did not return a completed payment. Please try again.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Payment failed.");
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <section className="worldGate paymentGate" aria-label="World Pay workflow unlock">
      <div className="worldGateCopy">
        <span>World Pay</span>
        <strong>{unlocked ? "Workflow access unlocked" : `Unlock launch runtime - ${payAmount} ${payToken}`}</strong>
        <p>
          {!verified
            ? "Complete World ID verification first."
            : paymentConfigured
              ? "One small payment unlocks the demo workflow runtime."
              : "Payment recipient is not configured yet. Set VITE_WORLD_PAY_TO in your hosting environment."}
        </p>
      </div>
      <button
        className={unlocked ? "worldVerify verified" : "worldVerify"}
        type="button"
        onClick={unlockWithPayment}
        disabled={!verified || unlocked || isPaying || !paymentConfigured}
      >
        {unlocked ? <CheckCircle2 size={17} /> : isPaying ? <Loader2 className="spin" size={17} /> : <CreditCard size={17} />}
        {unlocked ? "Payment unlocked" : isPaying ? "Opening World Pay..." : paymentConfigured ? "Pay to unlock" : "Payment setup pending"}
      </button>
      {message && <p className="worldGateStatus">{message}</p>}
    </section>
  );
}

function createPaymentReference() {
  const time = Date.now().toString(36);
  const random = crypto.randomUUID().replaceAll("-", "").slice(0, 10);
  return `ld-${time}-${random}`;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error("World Pay did not respond. Close the payment sheet and try again."));
    }, timeoutMs);

    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      }
    );
  });
}
