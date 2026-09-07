import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
