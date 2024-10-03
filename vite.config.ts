import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Sprachen Leser",
        short_name: "SprachenLeser",
        description: "Lector de documentos PDF con diccionario integrado",
        icons: [
          {
            src: "icon-512x512.png",
            sizes: "512x512",
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/proxy/dict-leo-org": {
        target: "https://dict.leo.org/",
        changeOrigin: true,
        rewrite: (path) => path.replace("/proxy/dict-leo-org", ""),
      },
    },
  },
});
