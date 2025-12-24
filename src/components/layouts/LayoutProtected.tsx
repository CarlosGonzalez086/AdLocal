import { useContext, type ReactElement } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { UserContext } from "../../context/UserContext ";

interface LayoutProtectedProps {
  children: ReactElement;
}

const drawerWidth = 240;

const LayoutProtected = ({ children }: LayoutProtectedProps) => {
  const user = useContext(UserContext);

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Sidebar drawerWidth={drawerWidth} />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Header user={user} />

        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            padding: "1rem",
            height: "100%",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutProtected;
