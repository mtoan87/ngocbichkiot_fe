import React from "react";
import {
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Stack,
  TextField,
  Typography,
  Box,
  Divider,
  IconButton,
  CircularProgress,
  alpha,
  useTheme,
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import CloseIcon from "@mui/icons-material/Close";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { toast } from "react-toastify";
import sourceOfProductApi from "@/axios-clients/source_of_product_api/sourceOfProductAPI";
import { colors, font_weight } from "@/styles/config-file";

interface CreateSourceProps {
  open: boolean;
  handleClose: () => void;
  fetchData: () => void;
}

const CreateSource: React.FC<CreateSourceProps> = ({
  open,
  handleClose,
  fetchData,
}) => {
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const theme = useTheme();

  const getErrorMessage = (error: any): string => {
    const message = error?.response?.data?.message;

    switch (message) {
      case "SourceOfProduct already exists.":
        return "Nhà cung cấp đã tồn tại.";
      default:
        if (message) return message;
        if (error.response?.status === 500)
          return "Lỗi máy chủ. Vui lòng thử lại sau.";
        if (error.request) return "Không nhận được phản hồi từ máy chủ.";
        return "Đã xảy ra lỗi. Vui lòng thử lại.";
    }
  };

  const handleSaveQuickCreate = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      await sourceOfProductApi.createSource({ name: name.trim() });
      setName("");
      toast.success("Tạo nhà cung cấp thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      handleClose();
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error), {
        autoClose: 5000,
        position: "top-right",
      });
      console.error("Lỗi khi tạo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !isInvalid && !loading) {
      handleSaveQuickCreate();
    }
  };

  const handleDialogClose = () => {
    if (!loading) {
      setName("");
      handleClose();
    }
  };

  const isInvalid = !name.trim() || loading;

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${colors.originPrimary} 0%, ${colors.originPrimary}cc 100%)`,
          color: colors.white,
          position: "relative",
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <AddBusinessIcon sx={{ color: "white" }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
              Thêm nhà cung cấp mới
            </Typography>
            <Typography
              variant="body2"
              sx={{ opacity: 0.9, fontSize: "0.875rem" }}
            >
              Tạo nhà cung cấp để quản lý sản phẩm
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleDialogClose}
          disabled={loading}
          sx={{
            position: "absolute",
            right: 18,
            top: 22,
            color: "inherit",
            backgroundColor: "rgba(255,255,255,0.1)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.2)",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, fontWeight: 500 }}
            >
              Thông tin nhà cung cấp
            </Typography>
            <TextField
              fullWidth
              label="Tên nhà cung cấp"
              placeholder="Nhập tên nhà cung cấp..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <StoreIcon
                    sx={{
                      mr: 1.5,
                      color: name ? "primary.main" : "action.active",
                      transition: "color 0.2s ease-in-out",
                    }}
                  />
                ),
              }}
              helperText={
                name.trim()
                  ? `${name.trim().length} ký tự`
                  : "Vui lòng nhập tên nhà cung cấp"
              }
            />
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 1.5, justifyContent: "flex-end" }}>
        <Button
          onClick={handleDialogClose}
          variant="outlined"
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 500,
            borderColor: "grey.300",
            color: "text.secondary",
            "&:hover": {
              borderColor: "grey.400",
              backgroundColor: "grey.50",
            },
          }}
        >
          Hủy bỏ
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveQuickCreate}
          disabled={isInvalid}
          sx={{
            flex: 1,
            borderRadius: 2,
            px: 4,
            py: 1.5,
            textTransform: "none",
            fontWeight: font_weight.bold || 600,
            background: `linear-gradient(135deg, ${
              colors.originPrimary
            } 0%, ${alpha(colors.originPrimary, 0.8)} 100%)`,
            boxShadow: `0 4px 12px ${alpha(colors.originPrimary, 0.3)}`,
            "&:hover": {
              background: `linear-gradient(135deg, ${alpha(
                colors.originPrimary,
                0.9
              )} 0%, ${alpha(colors.originPrimary, 0.7)} 100%)`,
              boxShadow: `0 6px 16px ${alpha(colors.originPrimary, 0.4)}`,
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              background: alpha(theme.palette.action.disabled, 0.12),
              color: theme.palette.action.disabled,
            },
            transition: "all 0.2s ease-in-out",
          }}
          startIcon={
            loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <AddBusinessIcon />
            )
          }
        >
          {loading ? "Đang tạo..." : "Tạo nhà cung cấp"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSource;
