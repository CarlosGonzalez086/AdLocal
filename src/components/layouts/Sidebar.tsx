import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import SettingsIcon from "@mui/icons-material/Settings";
import HistoryIcon from "@mui/icons-material/History";
import LogoAdLocal from "../../assets/IMG_6372.png";

interface SidebarProps {
  drawerWidth: number;
}

const Sidebar = ({ drawerWidth }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "Planes", icon: <PaymentIcon />, path: "/planes" },
    { text: "Usuarios", icon: <PeopleIcon />, path: "/usuarios" },
    {
      text: "Configuraciones",
      icon: <SettingsIcon />,
      path: "/configuraciones",
    },
    {
      text: "Historial de suscripciones",
      icon: <HistoryIcon />,
      path: "/historial-suscripciones",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 160,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 1,
          boxSizing: "border-box",
          backgroundColor: "#f5e9cf",
        }}
      >
        <Box
          component="img"
          src="/images/IMG_6372.png"
          alt="Logo AdLocal"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      <Divider />

      <List style={{ backgroundColor: "#f5e9cf" }} className="h-100">
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  backgroundColor: isSelected ? "#D2B48C" : "transparent",
                  color: isSelected ? "#e8692c" : "inherit",
                  "&:hover": {
                    backgroundColor: isSelected ? "#D2B48C" : "#f5f5f5",
                  },
                }}
              >
                <ListItemIcon
                  sx={{ color: isSelected ? "#e8692c" : "inherit" }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
