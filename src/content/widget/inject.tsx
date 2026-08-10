import React from "react";
import ReactDOM from "react-dom/client";
import tailwindStyles from "../../app/index.css?inline";
import App from "../../app/App";

const SHADOW_HOST_ID = "recap-widget-host";
let widgetHost: HTMLElement | null = null;
let reactRoot: ReactDOM.Root | null = null;

function injectShadowStyles(shadow: ShadowRoot) {
  const style = document.createElement("style");
  style.textContent = tailwindStyles;
  shadow.appendChild(style);
}

export function injectWidget() {
  if (widgetHost) return;
  console.log("[Recap] 🟢 Injecting widget");

  widgetHost = document.createElement("div");
  widgetHost.id = SHADOW_HOST_ID;
  document.body.appendChild(widgetHost);

  const shadow = widgetHost.attachShadow({ mode: "open" });
  injectShadowStyles(shadow);

  const mountPoint = document.createElement("div");
  shadow.appendChild(mountPoint);

  reactRoot = ReactDOM.createRoot(mountPoint);
  reactRoot.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

export function removeWidget() {
  if (!widgetHost) return;
  console.log("[Recap] 🔴 Removing widget");
  reactRoot?.unmount();
  widgetHost.remove();
  reactRoot = null;
  widgetHost = null;
}
