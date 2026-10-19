import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from "./App";
import theme from "./theme/theme";
import "./styles/bootstrap-overrides.css";
import "./App.css";
import "./styles/sweetalert.css";
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <div
      style={{ height: "100vh", width: "100vw", backgroundColor: "#F8F6F2" }}
    >
      <App />
    </div>
  </ThemeProvider>,
);
