const BASE_CHAIN_ID = "0x2105";
const BASE_CHAIN_ID_DECIMAL = 8453;
const BASE_USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const DEFAULT_BASE_USDC_RECEIVER = "0xc97785f7EEaBafFDE32436842AD4824cB4141f8b";
const ERC20_TRANSFER_SELECTOR = "0xa9059cbb";

type EthereumProvider = {
  request: <T = unknown>(args: { method: string; params?: unknown[] }) => Promise<T>;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export type BasePaymentConfig = {
  amountUsdc: string;
  receiver: string;
};

export type BasePaymentState =
  | "idle"
  | "connecting"
  | "ready"
  | "paying"
  | "confirmed"
  | "missing-wallet"
  | "missing-receiver"
  | "failed";

export function getBasePaymentConfig(): BasePaymentConfig {
  return {
    amountUsdc: import.meta.env.VITE_BASE_USDC_AMOUNT || "1",
    receiver: import.meta.env.VITE_BASE_USDC_RECEIVER || DEFAULT_BASE_USDC_RECEIVER
  };
}

export async function connectBaseWallet() {
  const provider = getProvider();
  await ensureBaseNetwork(provider);
  const accounts = await provider.request<string[]>({ method: "eth_requestAccounts" });
  const account = accounts[0];
  if (!account) throw new Error("No wallet account returned.");
  return account;
}

export async function payBaseUsdc(config: BasePaymentConfig) {
  if (!isAddress(config.receiver)) {
    throw new Error("Missing or invalid Base USDC receiver address.");
  }

  const provider = getProvider();
  await ensureBaseNetwork(provider);
  const accounts = await provider.request<string[]>({ method: "eth_requestAccounts" });
  const from = accounts[0];
  if (!from) throw new Error("No wallet account returned.");

  const data = encodeTransfer(config.receiver, parseUsdc(config.amountUsdc));
  return provider.request<string>({
    method: "eth_sendTransaction",
    params: [
      {
        from,
        to: BASE_USDC_ADDRESS,
        value: "0x0",
        data
      }
    ]
  });
}

function getProvider() {
  if (!window.ethereum) throw new Error("Base wallet provider not found.");
  return window.ethereum;
}

async function ensureBaseNetwork(provider: EthereumProvider) {
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BASE_CHAIN_ID }]
    });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? (error as { code?: number }).code : undefined;
    if (code !== 4902) throw error;
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: BASE_CHAIN_ID,
          chainName: "Base",
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: ["https://mainnet.base.org"],
          blockExplorerUrls: ["https://basescan.org"]
        }
      ]
    });
  }
}

function encodeTransfer(to: string, amount: bigint) {
  const address = to.toLowerCase().replace(/^0x/, "").padStart(64, "0");
  const value = amount.toString(16).padStart(64, "0");
  return `${ERC20_TRANSFER_SELECTOR}${address}${value}`;
}

function parseUsdc(value: string) {
  const [whole, fraction = ""] = value.trim().split(".");
  const normalizedFraction = fraction.padEnd(6, "0").slice(0, 6);
  return BigInt(whole || "0") * 1_000_000n + BigInt(normalizedFraction || "0");
}

function isAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}
