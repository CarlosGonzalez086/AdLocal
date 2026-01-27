import { Box } from "@mui/material";
import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";

import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import { UserContext } from "../../context/UserContext ";
import "../../styles/styles.css";

const drawerWidth = 240;
const collapsedWidth = 76;

const UserLayout = () => {
  const user = useContext(UserContext);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? collapsedWidth : drawerWidth;

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <UserHeader
        user={user}
        onMenuClick={() => setMobileOpen(true)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        sidebarWidth={sidebarWidth}
      />

      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        <UserSidebar
          drawerWidth={drawerWidth}
          collapsedWidth={collapsedWidth}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          collapsed={collapsed}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            mt: "68px",
            overflowY: "auto",
            px: { xs: 1.5, md: 3 },
          }}
          className="p-3"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default UserLayout;
