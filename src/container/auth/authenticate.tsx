"use client";
import authApi from "@/axios-clients/auth_api/authAPI";
import images from "@/constant/images";
import useAuth from "@/hook/useAuth";
import { colors, font_size } from "@/styles/config-file";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HttpsIcon from "@mui/icons-material/Https";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  Fade,
  alpha,
  useTheme,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React from "react";
import withAuth from "@/hook/checkRoute";

function Authenticate() {
  const route = useRouter();
  const theme = useTheme();
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState({
    email: "",
    password: "",
  });

  const [loginForm, setLoginForm] = React.useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!loginForm.email) {
      newErrors.email = "Vui lòng nhập tài khoản";
      isValid = false;
    }

    if (!loginForm.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
      isValid = false;
    } else if (loginForm.password.length < 3) {
      newErrors.password = "Mật khẩu phải có ít nhất 3 ký tự";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const res: any = await authApi.login(loginForm);
      localStorage.setItem("userInfor", JSON.stringify(res));
      const decoded: any = jwtDecode(res?.accessToken);
      console.log("first", decoded);
      setAuth({
        user: decoded,
        accessToken: res?.accessToken,
      });
      route.push("/admin/dashboard");
    } catch (error) {
      console.log("Login error", error);
      setErrors({
        email: "Tài khoản hoặc mật khẩu không chính xác",
        password: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setLoginForm({ ...loginForm, [field]: value });
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.1
        )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        backgroundImage: `url(${images.loginBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            elevation={12}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
            }}
          >
            {/* Header Section */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${
                  colors.green_300
                } 0%, ${alpha(colors.green_300, 0.8)} 100%)`,
                p: 4,
                textAlign: "center",
                color: "white",
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 2,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "4px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                }}
              >
                <img
                  src={images.logo_remove_bg.src}
                  alt="logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                sx={{
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                }}
              >
                Chào mừng trở lại
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                }}
              >
                Đăng nhập để tiếp tục
              </Typography>
            </Box>

            {/* Form Section */}
            <Box sx={{ p: 4 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Tài khoản"
                  id="email"
                  name="email"
                  type="email"
                  variant="outlined"
                  color="success"
                  value={loginForm.email}
                  error={!!errors.email}
                  helperText={errors.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onKeyPress={handleKeyPress}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircleIcon
                            sx={{
                              color: errors.email
                                ? "error.main"
                                : "success.main",
                            }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: `0 4px 20px ${alpha(colors.green_300, 0.2)}`,
                      },
                      "&.Mui-focused": {
                        boxShadow: `0 4px 20px ${alpha(colors.green_300, 0.3)}`,
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Mật khẩu"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  color="success"
                  value={loginForm.password}
                  error={!!errors.password}
                  helperText={errors.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  onKeyPress={handleKeyPress}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <HttpsIcon
                            sx={{
                              color: errors.password
                                ? "error.main"
                                : "success.main",
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: "success.main" }}
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: `0 4px 20px ${alpha(colors.green_300, 0.2)}`,
                      },
                      "&.Mui-focused": {
                        boxShadow: `0 4px 20px ${alpha(colors.green_300, 0.3)}`,
                      },
                    },
                  }}
                />

                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    component="a"
                    href="#"
                    sx={{
                      color: colors.green_300,
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        textDecoration: "underline",
                        color: alpha(colors.green_300, 0.8),
                      },
                    }}
                  >
                    Quên mật khẩu?
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  onClick={handleLogin}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <LoginIcon />
                    )
                  }
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: font_size.buttonFontSize,
                    fontWeight: "bold",
                    textTransform: "none",
                    background: `linear-gradient(135deg, ${
                      colors.green_300
                    } 0%, ${alpha(colors.green_300, 0.9)} 100%)`,
                    boxShadow: `0 8px 32px ${alpha(colors.green_300, 0.4)}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: `linear-gradient(135deg, ${alpha(
                        colors.green_300,
                        0.9
                      )} 0%, ${alpha(colors.green_300, 0.8)} 100%)`,
                      boxShadow: `0 12px 40px ${alpha(colors.green_300, 0.5)}`,
                      transform: "translateY(-2px)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                    "&:disabled": {
                      background: alpha(colors.green_300, 0.6),
                      boxShadow: "none",
                    },
                  }}
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </Stack>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                p: 2,
                textAlign: "center",
                bgcolor: alpha(theme.palette.grey[100], 0.5),
                borderTop: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.85rem" }}
              >
                © 2025 Your Company. All rights reserved.
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
export default withAuth(Authenticate, {
  requireAuth: false,
});
