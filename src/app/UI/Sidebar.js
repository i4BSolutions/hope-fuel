"use client";

import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  Box,
  Typography,
} from "@mui/material";

import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import FlagIcon from "@mui/icons-material/Flag";
import ModeOutlinedIcon from "@mui/icons-material/ModeOutlined";
import Divider from "@mui/material/Divider";


import { useRouter } from "next/navigation";


const drawerWidth = 250; // Full-width drawer
const miniDrawerWidth = 80; // Mini sidebar width

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Sidebar Menu Items
  const menuItems = [
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
      text: "ဖောင်အဖွင့်အပိတ်",
      icon: <ToggleOnOutlinedIcon />,
      path: "/formopenclose",
    },
    {
      text: "အချက်အလက်ပြင်ဆင်ခြင်း",
      icon: <ModeOutlinedIcon />,
      path: "/fundraisers",
    },
    {
      text: "ငွေစစ်ဆေးခြင်း",
      icon: <AttachMoneyIcon />,
      path: "/entryForm",
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
  ];

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
          },
        }}
      >
        <Toolbar />
        <List sx={{ flexGrow: 1 }}>
          <ListItem disablePadding>
            <IconButton
              onClick={() => setOpen(true)}
              sx={{
                color: "white",
                marginX: "auto",
                marginBottom: "20px",
                transition:
                  "background-color 0.3s ease-in-out, transform 0.2s ease",
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "#F59E0B",
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
              }}
            >
              <ListItemButton
                onClick={() => router.push(path)}
                sx={{
                  marginX: "15px",
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: "20px",
                  transition: "background 0.1s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#F59E0B",
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
              onClick={() => alert("Logging out!")}
              sx={{
                marginX: "15px",
                display: "flex",
                justifyContent: "center",
                borderRadius: "20px",
                transition: "background 0.1s ease-in-out",
                "&:hover": {
                  backgroundColor: "#F59E0B",
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
        onClose={() => setOpen(false)}
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
            onClick={() => setOpen(false)}
            sx={{
              color: "white",
              marginX: "auto",
              marginTop: "20px",
              marginBottom: "20px",
              transition:
                "background-color 0.3s ease-in-out, transform 0.2s ease",
              borderRadius: "50%",
              "&:hover": {
                backgroundColor: "#F59E0B",
                transform: "scale(1.1)",
              },
            }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "white" }}>
            My Logo
          </Typography>
        </Toolbar>
        <Divider
          sx={{
            backgroundColor: "#F59E0B",
            height: "4px",
            marginBottom: "17px",
          }}
        />

        <List>
          {menuItems.map(({ text, icon, path }) => (
            <ListItem
              key={text}
              disablePadding
              sx={{
                mx: "auto",
              }}
            >
              <ListItemButton
                onClick={() => router.push(path)}
                sx={{
                  marginX: "15px",
                  display: "flex",
                  justifyContent: "center",
                  transition: "background 0.1s",
                  borderRadius: "20px",
                  "&:hover": {
                    width: "80%",
                    backgroundColor: "#F59E0B",
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
              onClick={() => alert("Logging out!")}
              sx={{
                marginX: "15px",
                display: "flex",
                justifyContent: "center",
                transition: "background 0.1s",
                borderRadius: "20px",
                "&:hover": {
                  width: "80%",
                  backgroundColor: "#F59E0B",
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
