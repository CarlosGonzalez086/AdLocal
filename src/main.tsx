import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App";
import theme from "./theme/theme";
import "./index.css";
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <div style={{ height: "100vh", width: "100vw",backgroundColor:"#F2F2F7" }}>
      <App />
    </div>
  </ThemeProvider>,
);
