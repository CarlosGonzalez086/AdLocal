import { useContext } from "react";
import { UserContext } from "../../context/UserContext ";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const drawerWidth = 240;

const AdminLayout = () => {
  const user = useContext(UserContext);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar drawerWidth={drawerWidth} />
      <Box sx={{ flexGrow: 1 }}>
        <Header user={user} />
        <div className="p-3">
          <Outlet />
        </div>
      </Box>
    </Box>
  );
};

export default AdminLayout;
