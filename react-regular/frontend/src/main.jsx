import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ComPilotProvider } from "@compilot/react-sdk";
import { createAuthAdapter, createConfig } from "@compilot/react-sdk";
import { createSession } from "./compilot-config.ts";
const authAdapter = createAuthAdapter({ createSession });
const compilotConfig = createConfig({ authAdapter });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ComPilotProvider config={compilotConfig}>
      <App />
    </ComPilotProvider>
  </StrictMode>
);
