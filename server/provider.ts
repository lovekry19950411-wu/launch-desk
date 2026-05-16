import { OpenAIProvider } from "@openai/agents-openai";

export type ProviderName = "openai" | "alibaba";

export function getProviderName(): ProviderName {
  return process.env.MODEL_PROVIDER === "alibaba" ? "alibaba" : "openai";
}

export function getModelName(provider = getProviderName()) {
  if (provider === "alibaba") return process.env.ALIBABA_MODEL || process.env.OPENAI_MODEL || "qwen-plus";
  return process.env.OPENAI_MODEL || "gpt-5.5";
}

export function isProviderConfigured(provider = getProviderName()) {
  const key = provider === "alibaba" ? process.env.DASHSCOPE_API_KEY : process.env.OPENAI_API_KEY;
  return Boolean(key && !key.includes("replace"));
}

export function createModelProvider(provider = getProviderName()) {
  if (provider === "alibaba") {
    return new OpenAIProvider({
      apiKey: process.env.DASHSCOPE_API_KEY,
      baseURL: process.env.DASHSCOPE_BASE_URL || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
      useResponses: false
    });
  }

  return new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY,
    useResponses: true
  });
}
