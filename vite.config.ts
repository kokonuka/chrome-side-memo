import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        sidepanel: "src/sidepanel.html",
        background: "src/background.ts",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
