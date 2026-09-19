"use client";

import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Grid2,
  Divider,
  Card,
  CardContent,
  Fade,
  Zoom,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventIcon from "@mui/icons-material/Event";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import exportApi from "@/axios-clients/export_excel_api/ExportExcelAPI";
import IntroTour from "@/components/intro/IntroTour";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import withAuth from "@/hook/checkRoute";

const exportExcelIntroSteps = [
  {
    element: "#excel-export-card",
    title: "Xuất Excel",
    intro: "Chọn khoảng thời gian để xuất báo cáo.",
    position: "top",
  },
  {
    element: "#date-picker-from",
    title: "Chọn ngày bắt đầu",
    intro: "Chọn ngày bắt đầu cho khoảng thời gian xuất báo cáo.",
    position: "top",
  },
  {
    element: "#date-picker-to",
    title: "Chọn ngày kết thúc ",
    intro: "Chọn ngày kết thúc cho khoảng thời gian xuất báo cáo.",
    position: "top",
  },
  {
    element: "#info-card",
    title: "Thông tin xuất",
    intro: "Thông tin về file xuất.",
    position: "top",
  },
  {
    element: "#export-button",
    title: "Xuất Excel",
    intro: "Nhấn nút này để xuất báo cáo dưới dạng file Excel.",
    position: "top",
  },
];

function ExcelExportUI() {
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleExport = async () => {
    if (!fromDate) {
      setError("Vui lòng chọn ngày bắt đầu");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const exportToDate = toDate || fromDate;
      const formattedFromDate = fromDate.format("YYYY-MM-DD");
      const formattedToDate = exportToDate.format("YYYY-MM-DD");

      const response = await exportApi.exportExcelDateExport({
        fromDate: formattedFromDate,
        toDate: formattedToDate,
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-oficedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = `xuat_excel_${formattedFromDate}_den_${formattedToDate}.xlsx`;
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(`Xuất file Excel thành công: ${filename}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi xuất file"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                  color: "white",
                }}
              >
                <InsertDriveFileIcon sx={{ fontSize: 48 }} />
              </Box>
            </Box>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 600,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                backgroundClip: "text",
                textFillColor: "transparent",
                mb: 1,
              }}
            >
              Xuất Excel
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Chọn khoảng thời gian để xuất báo cáo
            </Typography>
          </Box>

          <Grid2 container spacing={3}>
            {/* Date Selection Card */}
            <Grid2 size={{ mobile: 12, desktop: 6 }}>
              <Fade in={true} timeout={800}>
                <Card
                  elevation={4}
                  id="excel-export-card"
                  sx={{
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 3,
                        gap: 2,
                      }}
                    >
                      <CalendarTodayIcon
                        color="primary"
                        sx={{ fontSize: 28 }}
                      />
                      <Typography variant="h5" component="h2" fontWeight={600}>
                        Chọn Thời Gian
                      </Typography>
                      <IntroTour
                        steps={exportExcelIntroSteps}
                        buttonContent={
                          <InfoOutlinedIcon sx={{ cursor: "pointer" }} />
                        }
                      />
                    </Box>

                    <Grid2 container spacing={3}>
                      <Grid2 size={{ mobile: 12, desktop: 6 }}>
                        <Box
                          id="date-picker-from"
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: "2px solid",
                            borderColor: fromDate ? "primary.main" : "grey.300",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              borderColor: "primary.main",
                              boxShadow: "0 4px 12px rgba(33,150,243,0.15)",
                            },
                          }}
                        >
                          <DatePicker
                            label="Từ ngày *"
                            value={fromDate}
                            onChange={(newValue) =>
                              setFromDate(newValue as Dayjs)
                            }
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                variant: "outlined",
                                error: !fromDate && error !== null,
                                helperText:
                                  !fromDate && error !== null
                                    ? "Vui lòng chọn ngày bắt đầu"
                                    : "",
                              },
                            }}
                          />
                        </Box>
                      </Grid2>

                      <Grid2 size={{ mobile: 12, desktop: 6 }}>
                        <Box
                          id="date-picker-to"
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: "2px solid",
                            borderColor: toDate ? "primary.main" : "grey.300",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              borderColor: "primary.main",
                              boxShadow: "0 4px 12px rgba(33,150,243,0.15)",
                            },
                          }}
                        >
                          <DatePicker
                            label="Đến ngày (tùy chọn)"
                            value={toDate}
                            onChange={(newValue) =>
                              setToDate(newValue as Dayjs)
                            }
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                variant: "outlined",
                                helperText:
                                  "Nếu không chọn, hệ thống sẽ sử dụng cùng ngày bắt đầu",
                              },
                            }}
                            minDate={fromDate || undefined}
                          />
                        </Box>
                      </Grid2>
                    </Grid2>
                  </CardContent>
                </Card>
              </Fade>
            </Grid2>

            {/* Info Card */}
            <Grid2 size={{ mobile: 12, desktop: 4 }}>
              <Fade in={true} timeout={1200}>
                <Card
                  id="info-card"
                  elevation={4}
                  sx={{
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <TrendingUpIcon sx={{ fontSize: 32, mr: 2 }} />
                      <Typography variant="h6" component="h3" fontWeight={600}>
                        Thông Tin Xuất
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                      • File xuất dạng Excel (.xlsx)
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                      • Bao gồm dữ liệu trong khoảng thời gian
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      • Tự động tải xuống sau khi xuất
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid2>
          </Grid2>

          {/* Alerts */}
          <Box sx={{ mt: 3 }}>
            {error && (
              <Zoom in={!!error}>
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    "& .MuiAlert-icon": { fontSize: 24 },
                  }}
                >
                  {error}
                </Alert>
              </Zoom>
            )}

            {success && (
              <Zoom in={!!success}>
                <Alert
                  severity="success"
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    "& .MuiAlert-icon": { fontSize: 24 },
                  }}
                >
                  {success}
                </Alert>
              </Zoom>
            )}
          </Box>

          {/* Export Button */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              id="export-button"
              variant="contained"
              size="large"
              onClick={handleExport}
              disabled={loading || !fromDate}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <FileDownloadIcon />
                )
              }
              sx={{
                minWidth: 250,
                minHeight: 56,
                borderRadius: 4,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                background: loading
                  ? "grey"
                  : "linear-gradient(45deg, #4CAF50 30%, #81C784 90%)",
                boxShadow: 6,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: !loading ? "translateY(-2px)" : "none",
                  boxShadow: !loading ? 12 : 6,
                  background: !loading
                    ? "linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)"
                    : "grey",
                },
                "&:disabled": {
                  color: "white",
                },
              }}
            >
              {loading ? "Đang xuất..." : "Xuất Excel"}
            </Button>
          </Box>

          {/* Selected Range Display */}
          {fromDate && (
            <Fade in={!!fromDate} timeout={600}>
              <Card
                sx={{
                  mt: 3,
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(5px)",
                }}
              >
                <CardContent sx={{ py: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <EventIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1" color="text.secondary">
                      Khoảng thời gian đã chọn:{" "}
                      <strong>{fromDate.format("DD/MM/YYYY")}</strong> đến{" "}
                      <strong>
                        {(toDate || fromDate).format("DD/MM/YYYY")}
                      </strong>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          )}
        </Container>
      </Box>
    </LocalizationProvider>
  );
}

export default withAuth(ExcelExportUI);
