import { useContext } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { UserContext } from "../../context/UserContext ";

const drawerWidth = 240;

const LayoutProtected = () => {
  const user = useContext(UserContext);

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100vh" }}>
      <Sidebar drawerWidth={drawerWidth} />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Header user={user} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            p: 2,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutProtected;
