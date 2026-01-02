import { Box } from "@mui/material";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../../context/UserContext ";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";

const drawerWidth = 240;

const UserLayout = () => {
  const user = useContext(UserContext);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <UserSidebar drawerWidth={drawerWidth} />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <UserHeader user={user} />
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};


export default UserLayout;