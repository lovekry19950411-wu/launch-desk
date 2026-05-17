import { MiniKit } from "@worldcoin/minikit-js";
import { Tokens, tokenToDecimals } from "@worldcoin/minikit-js/commands";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";

const payTo = import.meta.env.VITE_WORLD_PAY_TO as string | undefined;
const payAmount = Number(import.meta.env.VITE_WORLD_PAY_AMOUNT || "0.5");
const payToken = ((import.meta.env.VITE_WORLD_PAY_TOKEN as string | undefined) || Tokens.WLD) as Tokens;

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
    setMessage("");

    try {
      const recipient = payTo;
      if (!recipient) {
        setMessage("Payment recipient is not configured yet.");
        return;
      }

      const result = await MiniKit.pay({
        reference: `launch-desk-${crypto.randomUUID()}`,
        to: recipient,
        tokens: [
          {
            symbol: payToken,
            token_amount: tokenToDecimals(payAmount, payToken).toString()
          }
        ],
        description: `Launch Desk workflow unlock - ${payAmount} ${payToken}`,
        fallback: () => {
          setMessage("Open this inside World App to complete payment.");
        }
      });

      if (result.executedWith === "minikit" && result.data?.transactionId) {
        onUnlocked();
        setMessage(`Payment submitted: ${result.data.transactionId}`);
        return;
      }

      setMessage("Payment was not completed in World App.");
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
              : "Payment recipient is not configured yet. Set VITE_WORLD_PAY_TO in Vercel."}
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
