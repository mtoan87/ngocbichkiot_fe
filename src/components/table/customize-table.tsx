/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { OrderStatus } from "@/enum/OrderStatus";
import { colors, font_size } from "@/styles/config-file";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Fade,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
  Zoom,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { alpha, keyframes, styled } from "@mui/material/styles";
import { is, ta } from "date-fns/locale";
import moment from "moment";
import React, { ReactNode, use, useMemo } from "react";

interface CTbaleProps {
  tableHeaderTitle?: any;
  data?: any;
  title?: string;
  menuAction?: any;
  selectedData?: any;
  searchTool?: ReactNode;
  eventAction?: ReactNode;
  tableContainerId?: string;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  handleChangeRowsPerPage?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  total: number;
  size: number;
  page: number;
  loading?: boolean;
  onRowClick?: (row: any) => void;
  responsiveConfig?: {
    hideFormatsOnMobile?: string[];
    hideFormatsOnTablet?: string[];
    hideColumnsOnMobile?: string[];
    hideColumnsOnTablet?: string[];
  };
}

// Animations
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Enhanced Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.95
  )}, ${alpha(theme.palette.background.default, 0.98)})`,
  backdropFilter: "blur(20px)",
  borderRadius: 20,
  border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
  boxShadow: `
    0 10px 40px 0 ${alpha(theme.palette.common.black, 0.08)},
    0 2px 8px 0 ${alpha(theme.palette.common.black, 0.04)},
    inset 0 1px 0 ${alpha(theme.palette.common.white, 0.1)}
  `,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "1px",
    background: `linear-gradient(90deg, transparent, ${alpha(
      theme.palette.primary.main,
      0.4
    )}, transparent)`,
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  overflow: "hidden",
  background: alpha(theme.palette.background.paper, 0.6),
  backdropFilter: "blur(10px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  "& .MuiTable-root": {
    background: "transparent",
  },
  "& .MuiTableHead-root": {
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.primary.main,
      0.08
    )}, ${alpha(theme.palette.primary.light, 0.05)})`,
    backdropFilter: "blur(10px)",
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  },
  "& .MuiTableCell-head": {
    fontWeight: 700,
    color: theme.palette.primary.main,
    fontSize: "0.875rem",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    padding: "20px 16px",
    borderBottom: "none",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "60%",
      height: "2px",
      background: `linear-gradient(90deg, transparent, ${alpha(
        theme.palette.primary.main,
        0.3
      )}, transparent)`,
    },
  },
  "& .MuiTableCell-root": {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
    padding: "16px",
    transition: "all 0.2s ease-in-out",
  },
  "& .MuiTableRow-root": {
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    animation: `${slideIn} 0.6s ease-out`,
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      // transform: "translateX(4px)",
      boxShadow: `inset 4px 0 0 ${alpha(theme.palette.primary.main, 0.3)}`,
      "& .MuiTableCell-root": {
        backgroundColor: "transparent",
      },
    },
    "&:nth-of-type(even)": {
      backgroundColor: alpha(theme.palette.background.default, 0.02),
    },
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  borderRadius: 12,
  fontSize: "0.75rem",
  height: 28,
  border: "1px solid",
  backdropFilter: "blur(8px)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.15)}`,
  },
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  padding: "24px 24px 16px",
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.main,
    0.02
  )}, transparent)`,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "24px",
    right: "24px",
    height: "1px",
    background: `linear-gradient(90deg, ${alpha(
      theme.palette.primary.main,
      0.3
    )}, transparent, ${alpha(theme.palette.primary.main, 0.3)})`,
  },
}));

const LoadingSkeleton = styled(Skeleton)(({ theme }) => ({
  background: `linear-gradient(90deg, ${alpha(
    theme.palette.grey[300],
    0.1
  )} 25%, ${alpha(theme.palette.grey[300], 0.2)} 50%, ${alpha(
    theme.palette.grey[300],
    0.1
  )} 75%)`,
  backgroundSize: "200px 100%",
  animation: `${shimmer} 2s infinite linear`,
  borderRadius: 8,
}));

const ActionCell = styled(TableCell)(({ theme }) => ({
  position: "relative",
  "&:hover": {
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background: `radial-gradient(circle at center, ${alpha(
        theme.palette.primary.main,
        0.1
      )}, transparent)`,
      borderRadius: "inherit",
    },
  },
}));

const CustomizeTable: React.FC<CTbaleProps> = ({
  data,
  tableHeaderTitle,
  title,
  menuAction,
  selectedData,
  searchTool,
  tableContainerId,
  handleChangePage,
  handleChangeRowsPerPage,
  eventAction,
  page,
  size,
  total,
  loading = false,
  responsiveConfig,
  onRowClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const defaultResponsiveConfig = useMemo(
    () => ({
      hideFormatsOnMobile: ["datetime", "date", "boolean"],
      hideFormatsOnTablet: [],
      hideColumnsOnMobile: [],
      hideColumnsOnTablet: [],
    }),
    []
  );

  const finalResponsiveConfig = responsiveConfig || defaultResponsiveConfig;

  const visibleColumns = useMemo(() => {
    if (!tableHeaderTitle) return [];

    return tableHeaderTitle.filter((column: any) => {
      if (isMobile) {
        if (finalResponsiveConfig.hideColumnsOnMobile?.includes(column.id)) {
          return false;
        }
        if (
          finalResponsiveConfig.hideFormatsOnMobile?.includes(column.format)
        ) {
          return false;
        }
      }

      if (isTablet && !isMobile) {
        if (finalResponsiveConfig.hideColumnsOnTablet?.includes(column.id)) {
          return false;
        }
        if (
          finalResponsiveConfig.hideFormatsOnTablet?.includes(column.format)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [tableHeaderTitle, isMobile, isTablet, finalResponsiveConfig]);

  function getNestedValue(obj: any, path: any) {
    return path
      .split(".")
      .reduce((acc: any, part: any) => acc && acc[part], obj);
  }

  function formatValue(value: any, column: any) {
    if (value === null || value === undefined || value === "") return "-";

    // Date formatting
    if (column.format && column.format === "date") {
      if (value) {
        return moment(value).format("DD/MM/YYYY");
      }
      return "-";
    }

    if (column.format && column.format === "datetime") {
      if (value) {
        return moment(value).format("DD/MM/YYYY HH:mm");
      }
      return "-";
    }

    // Batch number
    if (column.format && column.format === "bathchNumber") {
      if (value) {
        return (
          <Chip
            label={`BATCH ${value}`}
            size="small"
            variant="outlined"
            sx={{
              bgcolor: alpha(theme.palette.info.main, 0.1),
              color: theme.palette.info.main,
              borderColor: alpha(theme.palette.info.main, 0.3),
              fontWeight: 600,
            }}
          />
        );
      }
      return "-";
    }

    if (column.format && column.format === "bathchNumber") {
      if (value) {
        return (
          <Chip
            label={`BATCH ${value}`}
            size="small"
            variant="outlined"
            sx={{
              bgcolor: alpha(theme.palette.info.main, 0.1),
              color: theme.palette.info.main,
              borderColor: alpha(theme.palette.info.main, 0.3),
              fontWeight: 600,
            }}
          />
        );
      }
      return "-";
    }

    // Role formatting
    if (column.format && column.format === "role") {
      const roleConfig = {
        Customer: { label: "Khách hàng", color: "primary" },
        Admin: { label: "Quản trị viên", color: "error" },
        Manager: { label: "Quản lý", color: "warning" },
        Staff: { label: "Nhân viên", color: "info" },
      };
      const config = roleConfig[value as keyof typeof roleConfig];
      if (config) {
        return (
          <StyledChip
            label={config.label}
            color={config.color as any}
            variant="filled"
          />
        );
      }
      return "-";
    }

    // Status formatting
    if (column.format && column.format === "status") {
      switch (value) {
        case "Active":
          return (
            <StyledChip
              label="Hoạt động"
              sx={{
                bgcolor: alpha(colors.green_200, 0.9),
                color: colors.green_800,
                borderColor: colors.green_400,
              }}
            />
          );
        case "UnActive":
          return (
            <StyledChip
              label="Không hoạt động"
              sx={{
                bgcolor: alpha(colors.red_200, 0.9),
                color: colors.red_600,
                borderColor: colors.red_400,
              }}
            />
          );
        default:
          return "-";
      }
    }

    // Image formatting
    if (column.format && column.format === "images") {
      if (Array.isArray(value) && value.length > 0) {
        return (
          <Box
            sx={{
              position: "relative",
              display: "inline-block",
              "&:hover": {
                transform: "scale(1.1)",
                transition: "transform 0.2s ease-in-out",
              },
            }}
          >
            <img
              src={value[0]?.urlPath}
              alt="product"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                objectFit: "cover",
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: `0 4px 12px ${alpha(
                  theme.palette.common.black,
                  0.1
                )}`,
              }}
            />
          </Box>
        );
      }
    }

    // Price formatting
    if (column.format && column.format === "price") {
      if (value === undefined || value === null) return "N/A";
      return (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: theme.palette.success.main,
            background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {value.toLocaleString("vi-VN")} VND
        </Typography>
      );
    }

    // Create date formatting
    if (column.format && column.format === "createDate") {
      if (value) {
        return (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            {moment(value).utcOffset(7).format("DD/MM/YYYY HH:mm:ss")}
          </Typography>
        );
      }
    }

    // Phone number formatting
    if (column.format && column.format === "phoneNumber") {
      if (!value) return "-";
      const digits = value.replace(/\D/g, "");
      if (digits.length === 10) {
        return `${digits.slice(0, 4)}.${digits.slice(4, 7)}.${digits.slice(7)}`;
      }
      return digits;
    }

    // Quantity formatting
    if (column.format && column.format === "quantity") {
      if (value) {
        return (
          <Chip
            label={value.toLocaleString("vi-VN")}
            size="small"
            variant="outlined"
            sx={{
              bgcolor: alpha(theme.palette.secondary.main, 0.1),
              color: theme.palette.secondary.main,
              borderColor: alpha(theme.palette.secondary.main, 0.3),
              fontWeight: 600,
            }}
          />
        );
      }
    }

    if (column.format && column.format === "checkNumber") {
      if (value <= 0) {
        return (
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{ color: colors.red_600 }}
          >
            0
          </Typography>
        );
      }
    }

    // Import/Export type
    if (column.format && column.format === "type") {
      const typeConfig = {
        Import: {
          label: "Nhập hàng",
          color: alpha(colors.blue_600, 0.9),
          bg: alpha(colors.blue_200, 0.9),
        },
        Export: {
          label: "Xuất hàng",
          color: alpha(colors.orange_600, 0.9),
          bg: alpha(colors.orange_200, 0.9),
        },
      };
      const config = typeConfig[value as keyof typeof typeConfig];
      if (config) {
        return (
          <StyledChip
            label={config.label}
            sx={{
              bgcolor: config.bg,
              color: config.color,
              borderColor: alpha(config.color, 0.3),
            }}
          />
        );
      }
      return "-";
    }

    // Deleted status
    if (column.format && column.format === "deleted") {
      switch (value) {
        case true:
          return (
            <StyledChip
              label="Không khả dụng"
              sx={{
                bgcolor: alpha(colors.red_200, 0.9),
                color: colors.red_800,
                borderColor: colors.red_400,
              }}
            />
          );
        case false:
          return (
            <StyledChip
              label="Đang khả dụng"
              sx={{
                bgcolor: alpha(colors.green_200, 0.9),
                color: colors.green_800,
                borderColor: colors.green_400,
              }}
            />
          );
        default:
          return "-";
      }
    }

    // expired
    if (column.format && column.format === "expired") {
      switch (value) {
        case true:
          return (
            <Chip
              label="HẾT HẠN"
              size="small"
              color="error"
              variant="filled"
              sx={{
                fontWeight: "bold",
                fontSize: "0.65rem",
                height: "24px",
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { opacity: 1 },
                  "50%": { opacity: 0.7 },
                  "100%": { opacity: 1 },
                },
              }}
            />
          );
        case false:
          return (
            <Chip
              label="CÒN HẠN"
              size="small"
              color="success"
              variant="filled"
              sx={{
                fontWeight: "bold",
                fontSize: "0.65rem",
                height: "24px",
              }}
            />
          );
        default:
          return "-";
      }
    }

    // Order status
    if (column.format && column.format === "orderStatus") {
      const statusConfig = {
        [OrderStatus.PENDING]: {
          label: "Chờ xử lý",
          bgcolor: alpha(colors.yellow_200, 0.9),
          color: colors.yellow_800,
          borderColor: colors.yellow_400,
        },
        [OrderStatus.FINISH]: {
          label: "Đã thanh toán",
          bgcolor: alpha(colors.green_200, 0.9),
          color: colors.green_800,
          borderColor: colors.green_400,
        },
        [OrderStatus.CANCELED]: {
          label: "Đã hủy",
          bgcolor: alpha(colors.red_200, 0.9),
          color: colors.red_800,
          borderColor: colors.red_400,
        },
        [OrderStatus.PREPARED]: {
          label: "Đã chuẩn bị",
          bgcolor: alpha(colors.blue_200, 0.9),
          color: colors.blue_800,
          borderColor: colors.blue_400,
        },
      };

      const config = statusConfig[value];
      if (config) {
        return (
          <StyledChip
            label={config.label}
            sx={{
              bgcolor: config.bgcolor,
              color: config.color,
              borderColor: config.borderColor,
            }}
          />
        );
      }
      return "-";
    }

    return value;
  }

  const renderSkeletonRows = () => {
    return Array.from({ length: size }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell>
          <LoadingSkeleton variant="text" width={30} height={20} />
        </TableCell>
        {tableHeaderTitle?.map((column: any) => (
          <TableCell key={`skeleton-${column.id}-${index}`}>
            <LoadingSkeleton
              variant="rectangular"
              width={Math.random() * 100 + 80}
              height={20}
            />
          </TableCell>
        ))}
        <TableCell>
          <LoadingSkeleton variant="circular" width={32} height={32} />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Fade in timeout={800}>
      <Box sx={{ minWidth: "auto", mx: "auto", p: 2, width: "auto" }}>
        <StyledCard>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <StyledCardHeader
              title={
                <Typography
                  sx={(theme) => ({
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "0.5px",
                    [theme.breakpoints.up("desktop")]: {
                      fontSize: font_size.desktopTitleFS,
                    },
                    [theme.breakpoints.between("tablet", "desktop")]: {
                      fontSize: font_size.tabletTitleFS,
                    },
                    [theme.breakpoints.down("mobile")]: {
                      fontSize: font_size.mobileTitleFS,
                    },
                  })}
                >
                  {title}
                </Typography>
              }
            />
            <Box sx={{ pr: 3 }}>{eventAction}</Box>
          </Box>

          {searchTool && <Box sx={{ px: 3, pb: 2 }}>{searchTool}</Box>}

          <CardContent sx={{ pt: 0 }}>
            <StyledTableContainer
              id={tableContainerId}
              sx={(theme) => ({
                [theme.breakpoints.up("desktop")]: {
                  minWidth: 650,
                },
                [theme.breakpoints.between("tablet", "desktop")]: {
                  minWidth: 450,
                },
                overflowX: "auto",
              })}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    {visibleColumns?.map((column: any) => (
                      <TableCell
                        key={column.id}
                        id={column.introId}
                        align={column.align || "left"}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                    {menuAction && (
                      <TableCell align="center">Thao tác</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ overflowX: "auto" }}>
                  {loading
                    ? renderSkeletonRows()
                    : data?.map((row: any, index: number) => (
                        <Zoom in key={index} timeout={300 + index * 50}>
                          <TableRow
                            onClick={() => {
                              if (onRowClick) onRowClick(row);
                            }}
                          >
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: theme.palette.text.secondary,
                                }}
                              >
                                {page * size + index + 1}
                              </Typography>
                            </TableCell>
                            {visibleColumns.map((column: any) => (
                              <TableCell
                                key={column.id}
                                align={column.align || "left"}
                              >
                                {formatValue(
                                  getNestedValue(row, column.id),
                                  column
                                )}
                              </TableCell>
                            ))}
                            {menuAction && (
                              <ActionCell
                                align="center"
                                onClick={(e) => {
                                  selectedData && selectedData(row);
                                  e.stopPropagation();
                                }}
                                sx={{
                                  cursor: selectedData ? "pointer" : "default",
                                }}
                              >
                                {menuAction}
                              </ActionCell>
                            )}
                          </TableRow>
                        </Zoom>
                      ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={total ?? 0}
                rowsPerPage={size ?? 10}
                page={page ?? 0}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Số hàng trên trang"
                labelDisplayedRows={({ from, to, count }) => {
                  return `${from}–${to} trên ${
                    count !== -1 ? count : `nhiều hơn ${to}`
                  }`;
                }}
                sx={{
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  background: alpha(theme.palette.background.default, 0.02),
                  "& .MuiTablePagination-toolbar": {
                    paddingLeft: 3,
                    paddingRight: 2,
                  },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    {
                      fontWeight: 500,
                      color: theme.palette.text.secondary,
                    },
                }}
              />
            </StyledTableContainer>
          </CardContent>
        </StyledCard>
      </Box>
    </Fade>
  );
};

export default CustomizeTable;
