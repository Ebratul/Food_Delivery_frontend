import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  build: {
    target: "es2022",
    sourcemap: false,
    rollupOptions: {
      output: {
        // keep heavy libraries in their own cacheable chunks
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("recharts") || id.includes("d3-") || id.includes("victory")) return "charts";
          if (id.includes("react-hook-form") || id.includes("zod") || id.includes("@hookform")) return "forms";
          if (id.includes("@tanstack") || id.includes("axios")) return "data";
          if (id.includes("react-router") || id.includes("react-dom") || id.includes("/react/") || id.includes("scheduler")) return "react";
          return undefined;
        },
      },
    },
  },
  esbuild: { drop: ["console", "debugger"] },
});
