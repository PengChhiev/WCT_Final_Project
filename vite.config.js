import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // GitHub Pages hosts this project under /WCT_Final_Project/.
  base: "/WCT_Final_Project/",
  plugins: [react(), tailwindcss()],
});
