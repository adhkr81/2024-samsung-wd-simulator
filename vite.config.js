import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/  
//test

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: "0.0.0.0",
  },
  // base: "/us/support/simulators/",
  assetsInclude: ["**/*.riv"],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: function (file) {
          return file.name.endsWith("svg") ? `assets/icons/[name].[ext]` : `assets/[name].[ext]`;
        },
      },
    },
  },
});
