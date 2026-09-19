import { Role } from "@/enum/Role";
import useAuth from "@/hook/useAuth";
import { font_size, font_weight } from "@/styles/config-file";
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import { AdminPanelSettings } from "@mui/icons-material";
import React from "react";

const Logo = () => {
  const { auth } = useAuth();
  const theme = useTheme();

  // Format role with enhanced styling
  const roleFormat = (role: any) => {
    switch (role) {
      case "1":
        return "Quản trị viên";
      default:
        return "Người dùng";
    }
  };

  // Get role color based on role type
  const getRoleColor = (role: any) => {
    switch (role) {
      case "1":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* Avatar Section */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{
            height: 120,
            width: 120,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            fontSize: "3rem",
            fontWeight: "bold",
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
            border: `3px solid ${alpha(theme.palette.common.white, 0.2)}`,
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: `0 12px 40px ${alpha(
                theme.palette.primary.main,
                0.4
              )}`,
            },
          }}
        >
          {auth?.user?.Name?.charAt(0)?.toUpperCase() || "U"}
        </Avatar>

        {/* Role Badge */}
        <Chip
          icon={<AdminPanelSettings />}
          label={roleFormat(auth?.user?.Role)}
          color={getRoleColor(auth?.user?.Role)}
          variant="filled"
          size="small"
          sx={{
            mt: 1,
            fontWeight: "medium",
            boxShadow: theme.shadows[2],
            "& .MuiChip-icon": {
              fontSize: "1rem",
            },
          }}
        />
      </Box>

      {/* Welcome Message */}
      <Box
        sx={{
          textAlign: "center",
          mt: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: font_size.subTitle || "1.1rem",
            fontWeight: font_weight.light || 300,
            color: theme.palette.text.secondary,
            mb: 0.5,
          }}
        >
          Chào mừng bạn trở lại
        </Typography>
      </Box>

      {/* Decorative Elements */}
      <Box
        sx={{
          width: "60px",
          height: "4px",
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          borderRadius: "2px",
          mt: 1,
        }}
      />
    </Box>
  );
};

export default Logo;
