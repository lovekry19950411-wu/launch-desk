import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import { App } from "./App";
import "./styles.css";

const worldAppId = import.meta.env.VITE_WORLD_APP_ID as string | undefined;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MiniKitProvider props={{ appId: worldAppId }}>
      <App />
    </MiniKitProvider>
  </StrictMode>
);
