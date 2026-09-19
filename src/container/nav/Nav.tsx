"use client";
import { colors } from "@/styles/config-file";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Avatar,
  Box,
  Card,
  CardMedia,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Fade,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import NavBar from "../sidebar_menu/NavBar";
import useAuth from "@/hook/useAuth";
import images from "@/constant/images";

interface menuSettingProps {
  open: boolean;
}

interface menuSettingType {
  id: number;
  itemName: string;
  path?: string;
  icon: React.ReactNode;
}

const Nav = () => {
  //auth context
  const { auth } = useAuth();

  //Define the state for the drawer
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => () => {
    setOpen(!open);
  };

  //Define the state and func for menu setting
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenuSetting = Boolean(anchorEl);
  const handleClickOpenMenuSetting = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /*Create menu setting*/
  const menuSettingArray: menuSettingType[] = [
    {
      id: 1,
      itemName: "Tài khoản",
      icon: <AccountCircleIcon fontSize="small" />,
    },
    {
      id: 2,
      itemName: "Cài Đặt",
      icon: <SettingsIcon fontSize="small" />,
    },
  ];

  const SettingMenu: React.FC<menuSettingProps> = ({ open }) => {
    return (
      <Menu
        id="settings-menu"
        aria-labelledby="settings-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1,
            borderRadius: 2,
            minWidth: 180,
            background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
            border: "1px solid rgba(0,0,0,0.08)",
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1.5,
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                transform: "translateX(4px)",
              },
            },
          },
        }}
      >
        {menuSettingArray.map((item) => (
          <MenuItem key={item.id} onClick={handleClose}>
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.itemName} />
          </MenuItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <MenuItem
          onClick={logout}
          sx={{
            color: "error.main",
            "&:hover": {
              backgroundColor: "rgba(244, 67, 54, 0.08) !important",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "error.main" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Đăng xuất" />
        </MenuItem>
      </Menu>
    );
  };

  //For responsive and css
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("desktop"));

  //Log out func
  const route = useRouter();

  const logout = () => {
    localStorage.clear();
    handleClose();
    route.push("/");
  };

  // Generate gradient background based on user name
  const getAvatarGradient = (name?: string) => {
    if (!name) return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    ];

    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <Box>
      {!isDesktop ? (
        <Box>
          <AppBar
            position="fixed"
            sx={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              color: colors.dark,
            }}
          >
            <Toolbar
              sx={{
                height: 70,
                px: 2,
              }}
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer()}
                sx={{
                  mr: 2,
                  borderRadius: 2,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>

              <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <img
                    src={images.logo_remove_bg.src}
                    alt="logo"
                    style={{
                      width: 100,
                      height: "auto",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  />
                </Box>
              </Box>

              <IconButton
                onClick={handleClickOpenMenuSetting}
                sx={{
                  p: 0.5,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 45,
                    height: 45,
                    background: getAvatarGradient(auth?.user?.Name),
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    border: "2px solid rgba(255,255,255,0.8)",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  {auth?.user?.Name?.charAt(0)?.toUpperCase()}
                </Avatar>
              </IconButton>
              <SettingMenu open={openMenuSetting} />
            </Toolbar>
          </AppBar>

          <Drawer
            open={open}
            onClose={toggleDrawer()}
            sx={{
              zIndex: 2000,
              "& .MuiDrawer-paper": {
                borderRadius: "0 16px 16px 0",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              },
            }}
          >
            <NavBar />
          </Drawer>
        </Box>
      ) : (
        <Box>
          <AppBar
            position="fixed"
            elevation={0}
            sx={{
              // background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              bgcolor: colors.grey_100,
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              color: colors.dark,
            }}
          >
            <Toolbar
              sx={{
                height: 80,
                px: 3,
                boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.4)",
              }}
            >
              <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <img
                    src={images.logo_remove_bg.src}
                    alt="Logo"
                    style={{
                      width: 120,
                      height: 85,
                      filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))",
                    }}
                  />
                </Box>
              </Box>

              <IconButton
                onClick={handleClickOpenMenuSetting}
                sx={{
                  p: 0.5,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 55,
                    height: 55,
                    background: getAvatarGradient(auth?.user?.Name),
                    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                    border: "3px solid rgba(255,255,255,0.8)",
                    fontSize: "1.3rem",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  {auth?.user?.Name?.charAt(0)?.toUpperCase()}
                </Avatar>
              </IconButton>
              <SettingMenu open={openMenuSetting} />
            </Toolbar>
          </AppBar>
          <NavBar />
        </Box>
      )}
    </Box>
  );
};

export default Nav;
