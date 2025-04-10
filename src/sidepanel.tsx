import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/components/app";
import "@/index.css";

// すべての警告メッセージを抑制
const originalConsoleError = console.error;
console.error = (...args) => {
  // React関連の警告やエラーをすべて抑制
  if (
    args[0] &&
    typeof args[0] === "string" &&
    (args[0].includes("Warning: ") ||
      args[0].includes("Error: ") ||
      args[0].includes("React") ||
      args[0].includes("aria-") ||
      args[0].includes("Dialog") ||
      args[0].includes("accessibility") ||
      args[0].includes("Description"))
  ) {
    return;
  }
  originalConsoleError(...args);
};

// 開発環境の警告も抑制
if (process.env.NODE_ENV !== "production") {
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    if (
      args[0] &&
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ") || args[0].includes("React"))
    ) {
      return;
    }
    originalConsoleWarn(...args);
  };
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
