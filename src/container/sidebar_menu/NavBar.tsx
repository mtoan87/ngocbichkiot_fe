import { num } from "@/cons/cons";
import { colors } from "@/styles/config-file";
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  alpha,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Logo from "./Logo";
import { MenuItems } from "./SideBarMenu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const NavBar = () => {
  const pathName = usePathname();

  const isActive = (path: string) => {
    return pathName.includes(path);
  };

  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  const handleClick = (index: number) => {
    setOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Paper
      elevation={2}
      sx={{
        maxWidth: num.SIDEBAR_WITH,
        width: "100%",
        height: "100vh",
        position: "fixed",
        bgcolor: colors.grey_100,
        borderRadius: 0,
        borderRight: `1px solid ${alpha(colors.grey, 0.12)}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          pt: { xs: 2, sm: 2, md: 14 },
          pb: 2,
          borderBottom: `1px solid ${alpha(colors.grey, 0.08)}`,
          bgcolor: alpha(colors.green_100, 0.05),
        }}
      >
        <Logo />
      </Box>

      {/* Scrollable Menu Section */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: alpha(colors.grey, 0.2),
            borderRadius: "3px",
            "&:hover": {
              bgcolor: alpha(colors.grey, 0.3),
            },
          },
        }}
      >
        <List
          sx={{
            py: 2,
            px: 1,
          }}
        >
          {MenuItems.map((itemNav, index) =>
            !itemNav?.children ? (
              <Box key={index} sx={{ mb: 0.5 }}>
                <Link style={{ textDecoration: "none" }} href={itemNav?.path}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      borderRadius: 2,
                      mb: 0.5,
                      transition: "all 0.2s ease-in-out",
                      bgcolor: isActive(itemNav?.path)
                        ? alpha(colors.green_700, 0.15)
                        : "transparent",
                      color: isActive(itemNav?.path)
                        ? colors.green_700
                        : colors.grey,
                      border: isActive(itemNav?.path)
                        ? `1px solid ${alpha(colors.green_700, 0.3)}`
                        : "1px solid transparent",
                      "&:hover": {
                        bgcolor: isActive(itemNav?.path)
                          ? alpha(colors.green_700, 0.2)
                          : alpha(colors.grey, 0.05),
                        transform: "translateX(4px)",
                        boxShadow: `0 2px 8px ${alpha(colors.grey, 0.1)}`,
                      },
                      "&:active": {
                        transform: "translateX(2px)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: "inherit",
                        "& svg": {
                          fontSize: "1.2rem",
                        },
                      }}
                    >
                      {itemNav.icon && React.createElement(itemNav.icon)}
                    </ListItemIcon>
                    <ListItemText
                      primary={itemNav?.label}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: isActive(itemNav?.path) ? 600 : 500,
                      }}
                    />
                  </ListItemButton>
                </Link>
              </Box>
            ) : (
              <Box key={index} sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleClick(index)}
                  sx={{
                    minHeight: 48,
                    borderRadius: 2,
                    mb: 0.5,
                    transition: "all 0.2s ease-in-out",
                    color: colors.grey,
                    "&:hover": {
                      bgcolor: alpha(colors.grey, 0.05),
                      transform: "translateX(4px)",
                      boxShadow: `0 2px 8px ${alpha(colors.grey, 0.1)}`,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: "inherit",
                      "& svg": {
                        fontSize: "1.2rem",
                      },
                    }}
                  >
                    {itemNav.icon && React.createElement(itemNav.icon)}
                  </ListItemIcon>
                  <ListItemText
                    primary={itemNav?.label}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  />
                  <Box
                    sx={{
                      transition: "transform 0.2s ease-in-out",
                      transform: open[index] ? "rotate(0deg)" : "rotate(0deg)",
                    }}
                  >
                    {open[index] ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                </ListItemButton>

                <Collapse
                  in={open[index] || false}
                  timeout="auto"
                  unmountOnExit
                >
                  <List
                    component="div"
                    disablePadding
                    sx={{
                      ml: 2,
                      borderLeft: `2px solid ${alpha(colors.green_700, 0.2)}`,
                      pl: 1,
                    }}
                  >
                    {itemNav?.children.map((item, childIndex) => (
                      <Link
                        key={childIndex}
                        style={{ textDecoration: "none" }}
                        href={item?.path}
                      >
                        <ListItemButton
                          sx={{
                            minHeight: 44,
                            borderRadius: 2,
                            mb: 0.5,
                            ml: 1,
                            transition: "all 0.2s ease-in-out",
                            bgcolor: isActive(item?.path)
                              ? alpha(colors.green_700, 0.15)
                              : "transparent",
                            color: isActive(item?.path)
                              ? colors.green_700
                              : alpha(colors.grey, 0.8),
                            border: isActive(item?.path)
                              ? `1px solid ${alpha(colors.green_700, 0.3)}`
                              : "1px solid transparent",
                            "&:hover": {
                              bgcolor: isActive(item?.path)
                                ? alpha(colors.green_700, 0.2)
                                : alpha(colors.grey, 0.05),
                              transform: "translateX(4px)",
                              boxShadow: `0 2px 8px ${alpha(colors.grey, 0.1)}`,
                            },
                            "&:active": {
                              transform: "translateX(2px)",
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 36,
                              color: "inherit",
                              "& svg": {
                                fontSize: "1rem",
                              },
                            }}
                          >
                            {item.icon && React.createElement(item.icon)}
                          </ListItemIcon>
                          <ListItemText
                            primary={item?.label}
                            primaryTypographyProps={{
                              fontSize: "0.8rem",
                              fontWeight: isActive(item?.path) ? 600 : 400,
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    ))}
                  </List>
                </Collapse>
              </Box>
            )
          )}
        </List>
      </Box>
    </Paper>
  );
};

export default NavBar;
