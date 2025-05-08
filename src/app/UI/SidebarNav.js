"use client";

import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FlagIcon from "@mui/icons-material/Flag";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";
import Divider from "@mui/material/Divider";
import { signOut } from "aws-amplify/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAgentStore } from "../../stores/agentStore";

const drawerWidth = 250; // Full-width drawer
const miniDrawerWidth = 80; // Mini sidebar width

const roleBasedNavItems = {
  2: [
    {
      text: "အသစ်သွင်းခြင်း",
      icon: <AddCircleOutlineIcon />,
      path: "/createForm",
    },
    {
      text: "သက်တမ်းတိုးခြင်း",
      icon: <SyncAltRoundedIcon />,
      path: "/extendUser",
    },
    { text: "ငွေစစ်ဆေးခြင်း", icon: <AttachMoneyIcon />, path: "/entryForm" },
    {
      text: "Admin Panel",
      icon: <ManageAccountsIcon />,
      path: "/admin-panel",
    },
    {
      text: "HOPEID List",
      icon: <FormatListBulletedRoundedIcon />,
      path: "/hopefuelidlist",
    },
    {
      text: "Customers List",
      icon: <PeopleAltOutlinedIcon />,
      path: "/customerlist",
    },
    {
      text: "Fundraisers",
      icon: <FlagIcon />,
      path: "/fundraisers",
    },
  ],
  1: [
    {
      text: "အသစ်သွင်းခြင်း",
      icon: <AddCircleOutlineIcon />,
      path: "/createForm",
    },
    { text: "ငွေစစ်ဆေးခြင်း", icon: <AttachMoneyIcon />, path: "/entryForm" },
    {
      text: "သက်တမ်းတိုးခြင်း",
      icon: <SyncAltRoundedIcon />,
      path: "/extendUser",
    },
    {
      text: "HOPEID List",
      icon: <FormatListBulletedRoundedIcon />,
      path: "/hopefuelidlist",
    },
    {
      text: "Customers List",
      icon: <PeopleAltOutlinedIcon />,
      path: "/customerlist",
    },
    {
      text: "Fundraisers",
      icon: <FlagIcon />,
      path: "/fundraisers/",
    },
  ],
  3: [
    {
      text: "အသစ်သွင်းခြင်း",
      icon: <AddCircleOutlineIcon />,
      path: "/createForm",
    },
    {
      text: "သက်တမ်းတိုးခြင်း",
      icon: <SyncAltRoundedIcon />,
      path: "/extendUser",
    },
    {
      text: "ငွေစစ်ဆေးခြင်း",
      icon: <AttachMoneyIcon />,
      path: "/entryForm",
    },
    {
      text: "Customers List",
      icon: <PeopleAltOutlinedIcon />,
      path: "/customerlist",
    },
  ],
};

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const { agent } = useAgentStore();

  useEffect(() => {
    if (agent) {
      const roleBasedMenuItems = roleBasedNavItems[agent.roleId] || [];
      setMenuItems(roleBasedMenuItems);
    }
  }, [agent]);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Mini Sidebar (Always Visible) */}
      <Drawer
        variant="permanent"
        sx={{
          width: miniDrawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: miniDrawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#b71c1c",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflowX: "hidden",
          },
        }}
      >
        <List sx={{ flexGrow: 1 }}>
          <ListItem disablePadding>
            <IconButton
              onClick={() => setOpen((prevState) => !prevState)}
              sx={{
                color: "white",
                marginX: "auto",
                marginTop: "8px",
                marginBottom: "20px",
                transition:
                  "background-color 0.2s ease-in-out, transform 0.1s ease",
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "#991B1B",
                  transform: "scale(1.1)",
                },
              }}
            >
              <MenuRoundedIcon />
            </IconButton>
          </ListItem>

          <Divider
            sx={{
              backgroundColor: "#F59E0B",
              height: "4px",
              marginBottom: "17px",
            }}
          />
          {menuItems.map(({ icon, path }, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{
                mx: "auto",
                marginTop: "10px",
              }}
            >
              <ListItemButton
                onClick={() => router.push(path)}
                sx={{
                  marginX: "15px",
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: "20px",
                  backgroundColor:
                    pathname === path ? "#F59E0B" : "transparent",
                  transition:
                    "background-color 0.2s ease-in-out, transform 0.1s ease",
                  borderRadius: "50px",
                  "&:hover": {
                    backgroundColor: "#991B1B",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white", marginLeft: "30px" }}>
                  {icon}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: "auto", mb: 2 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                signOut({ global: true });
                router.push("/");
              }}
              sx={{
                marginX: "15px",
                display: "flex",
                justifyContent: "center",
                borderRadius: "20px",
                transition:
                  "background-color 0.2s ease-in-out, transform 0.1s ease",
                borderRadius: "50px",
                "&:hover": {
                  backgroundColor: "#F59E0B",
                  transform: "scale(1.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white", marginLeft: "30px" }}>
                <LogoutIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>

      {/* Expandable Drawer (Opens on Hamburger Click) */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen((prevState) => !prevState)}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#b71c1c",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Toolbar>
          {/* Logo & Title */}

          <IconButton
            onClick={() => setOpen((prevState) => !prevState)}
            sx={{
              color: "white",
              marginX: "auto",
              marginTop: "20px",
              marginBottom: "20px",
              transition:
                "background-color 0.3s ease-in-out, transform 0.2s ease",
              borderRadius: "50%",
              "&:hover": {
                backgroundColor: "#991B1B",
                transform: "scale(1.1)",
              },
            }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              color: "white",
              marginLeft: "13px",
              fontWeight: "bold",
            }}
          >
            HopeFuel
          </Typography>
        </Toolbar>
        <Divider
          sx={{
            backgroundColor: "#F59E0B",
            height: "4px",
          }}
        />

        <List>
          {menuItems.map(({ text, icon, path }) => (
            <ListItem
              key={text}
              disablePadding
              sx={{
                mx: "auto",
                marginTop: "10px",
              }}
            >
              <ListItemButton
                onClick={() => router.push(path)}
                sx={{
                  marginX: "15px",
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor:
                    pathname === path ? "#F59E0B" : "transparent",
                  transition:
                    "background-color 0.3s ease-in-out, transform 0.2s ease",
                  borderRadius: "20px",
                  "&:hover": {
                    backgroundColor: "#991B1B",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: "auto", mb: 2 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                signOut({ global: true });
                router.push("/");
              }}
              sx={{
                marginX: "15px",
                display: "flex",
                justifyContent: "center",
                transition:
                  "background-color 0.3s ease-in-out, transform 0.2s ease",
                borderRadius: "20px",
                "&:hover": {
                  backgroundColor: "#F59E0B",
                  transform: "scale(1.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
