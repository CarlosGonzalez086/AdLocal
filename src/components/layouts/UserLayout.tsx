import { Box } from "@mui/material";
import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";

import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import { UserContext } from "../../context/UserContext ";

const drawerWidth = 240;

const UserLayout = () => {
  const user = useContext(UserContext);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <UserSidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        collapsed={collapsed}
      />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <UserHeader
          user={user}
          onMenuClick={() => setMobileOpen(true)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />

        <Box
          sx={{
            flexGrow: 1,
            minHeight: 0, 
            overflowY: "auto",
            width: "100%",
            backgroundColor: "#fff",
            padding: "16px",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default UserLayout;
