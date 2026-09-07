import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "logo-adlocal.png",
        "apple-touch-icon.png",
        "pwa-64x64.png",
        "pwa-192x192.png",
        "pwa-512x512.png",
        "maskable-icon-512x512.png",
      ],
      manifest: {
        name: "ADLocal - Tu Puente con la Comunidad",
        short_name: "ADLocal",
        description:
          "Descubre comercios locales, gestiona tu negocio, productos, citas y pedidos.",
        theme_color: "#008989",
        background_color: "#F8F6F2",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        categories: ["shopping", "business", "lifestyle"],
        icons: [
          {
            src: "/pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "jsdelivr-cdn",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    include: ["leaflet", "react-leaflet"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-apexcharts") || id.includes("apexcharts")) {
              return "vendor-apexcharts";
            }
            if (id.includes("leaflet") || id.includes("react-leaflet")) {
              return "vendor-leaflet";
            }
            if (id.includes("@stripe")) {
              return "vendor-stripe";
            }
            if (id.includes("@mui/x-date-pickers") || id.includes("dayjs")) {
              return "vendor-pickers";
            }
            if (id.includes("@mui/icons-material")) {
              return "vendor-mui-icons";
            }
            if (id.includes("@mui") || id.includes("@emotion")) {
              return "vendor-mui-core";
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
