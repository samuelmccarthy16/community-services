import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Replace 'your-repo-name' with your actual GitHub repository name
const repoName = "community-services";
export default defineConfig(({ mode }) => ({
 base: `/community-services/`,
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));