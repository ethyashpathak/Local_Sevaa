import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables from the client directory root
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      // Stringify the env object so process.env reads accurately in existing code
      "process.env": env,
    },
    server: {
      port: 3000, // Keep development port as 3000 for standard react client apps
    },
  };
});
