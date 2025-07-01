import { AGENT_ROLE, COOKIE_KEY } from "@/lib/constants";
import { useAgentStore } from "@/stores/agentStore";
import AdbIcon from "@mui/icons-material/Adb";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { signOut } from "aws-amplify/auth";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import * as React from "react";

const settings = [
  { icon: <PersonOutlineIcon />, label: "Account" },
  { icon: <SignalCellularAltIcon />, label: "Dashboard" },
  { icon: <LogoutIcon />, label: "Logout" },
];

export default function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const router = useRouter();
  const { agent } = useAgentStore();

  // Define navigation items
  let navItems = [];

  if (!agent) {
    navItems = [{ label: "Still loading", path: "/createForm" }];
  } else if (agent.roleId === AGENT_ROLE.ADMIN) {
    navItems = [
      { label: "အသစ်သွင်းခြင်း", path: "/createForm" },
      { label: "သက်တမ်းတိုးခြင်း", path: "/extendUser" },
      { label: "ဖောင်အဖွင့်အပိတ်", path: "/formopenclose" },
      { label: "ငွေစစ်ဆေးခြင်း", path: "/entryForm" },
      // { label: "ရှာဖွေခြင်း", path: "/search" },
      // { label: "HopeFuelDetail", path: "/details" },
    ];
  } else if (agent.roleId === AGENT_ROLE.SUPPORT_AGENT) {
    navItems = [
      { label: "အသစ်သွင်းခြင်း", path: "/createForm" },
      { label: "သက်တမ်းတိုးခြင်း", path: "/extendUser" },
      // { label: "ဖောင်အဖွင့်အပိတ်", path: "/formopenclose" },
      { label: "PRFHQ List", path: "/hopefuelidlist" },
      { label: "Customers List", path: "/customerlist" },

      // { label: "ရှာဖွေခြင်း", path: "/search" },
      // { label: "HopeFuelDetail", path: "/details" },
    ];
  } else if (agent.roleId === AGENT_ROLE.PAYMENT_PROCESSOR) {
    navItems = [
      { label: "အသစ်သွင်းခြင်း", path: "/createForm" },
      { label: "သက်တမ်းတိုးခြင်း", path: "/extendUser" },
      { label: "ငွေစစ်ဆေးခြင်း", path: "/entryForm" },
      // { label: "ရှာဖွေခြင်း", path: "/search" },
      // { label: "HopeFuelDetail", path: "/details" },
    ];
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleUserMenuClick = async (setting) => {
    handleCloseUserMenu();
    switch (setting.label) {
      case "Account":
        router.push("/account");
        break;
      case "Dashboard":
        router.push("/dashboard");
        break;
      case "Logout":
        await signOut({ global: true });
        deleteCookie(COOKIE_KEY);
        router.push("/");
        break;
      default:
        break;
    }
  };

  const handleNavItemClick = (path) => {
    router.push(path);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Hope
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "block" }, flexGrow: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                sx={{ color: "#fff" }}
                onClick={() => handleNavItemClick(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                <MenuItem
                  key={index}
                  onClick={() => handleUserMenuClick(setting)}
                  sx={{ color: setting.label === "Logout" ? "red" : "black" }}
                >
                  {setting.icon}
                  <Typography textAlign="center" sx={{ ml: 1.5 }}>
                    {setting.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
