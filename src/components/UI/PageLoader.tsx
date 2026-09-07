import { CircularProgress } from "@mui/material";

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const PageLoader = ({
  message = "Cargando...",
  fullScreen = false,
}: PageLoaderProps) => {
  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center ${
        fullScreen ? "vh-100 vw-100" : "py-5 my-4"
      }`}
      style={{ minHeight: fullScreen ? "100vh" : "280px" }}
      role="status"
      aria-live="polite"
    >
      <CircularProgress
        size={40}
        thickness={4}
        sx={{
          color: "#008989",
          mb: 2,
        }}
      />
      <span className="fz-body text-secondary fw-medium">{message}</span>
    </div>
  );
};

export default PageLoader;
