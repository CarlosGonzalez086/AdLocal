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
      <div className="w-100 h-100 d-flex flex-column">
        <UserHeader user={user} />
        <div className="flex-grow-1 p-3 overflow-auto">
          <Outlet />
        </div>
      </div>
    </Box>
  );
};

export default UserLayout;
