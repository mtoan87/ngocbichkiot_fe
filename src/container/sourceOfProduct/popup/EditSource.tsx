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
  alpha,
  useTheme,
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";
import sourceOfProductApi from "@/axios-clients/source_of_product_api/sourceOfProductAPI";
import { colors, font_weight } from "@/styles/config-file";

interface EditSourceProps {
  source: any;
  open: boolean;
  handleClose: () => void;
  fetchData: () => void;
}

const EditSource: React.FC<EditSourceProps> = ({
  open,
  source,
  handleClose,
  fetchData,
}) => {
  const [name, setName] = React.useState(source?.name || "");
  const [isLoading, setIsLoading] = React.useState(false);
  const theme = useTheme();

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open && source) {
      setName(source.name || "");
    }
  }, [open, source]);

  const getErrorMessage = (error: any): string => {
    const message = error?.response?.data?.message;

    switch (message) {
      case "Cannot update sourceofproduct because it is in use by some products.":
        return "Không thể cập nhật nhà cung cấp vì nó đang được sử dụng bởi một số sản phẩm.";
      default:
        if (message) return message;
        if (error.response?.status === 500)
          return "Lỗi máy chủ. Vui lòng thử lại sau.";
        if (error.request) return "Không nhận được phản hồi từ máy chủ.";
        return "Đã xảy ra lỗi. Vui lòng thử lại.";
    }
  };

  const handleSaveQuickEdit = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await sourceOfProductApi.updateSource(source.id, { name: name.trim() });
      toast.success("Cập nhật nhà cung cấp thành công!", {
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
      console.error("Lỗi khi cập nhật:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !isInvalid && !isLoading) {
      handleSaveQuickEdit();
    }
  };

  const isInvalid = !name.trim() || name.trim() === source?.name;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: {
          backgroundColor: alpha(theme.palette.common.black, 0.6),
          backdropFilter: "blur(4px)",
        },
      }}
    >
      {/* Header với gradient và icon đẹp */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${colors.originPrimary} 0%, ${colors.originPrimary}cc 100%)`,
          color: colors.white,
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.common.white, 0.2),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EditIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
              Cập nhật nhà cung cấp
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontSize: "0.875rem",
              }}
            >
              Chỉnh sửa thông tin nhà cung cấp "{source?.name}"
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 18,
            top: 28,
            color: "white",
            backgroundColor: alpha(theme.palette.common.white, 0.1),
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider
        sx={{
          background: `linear-gradient(90deg, transparent 0%, ${theme.palette.primary.main} 50%, transparent 100%)`,
          height: 2,
        }}
      />

      <DialogContent sx={{ px: 3, py: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: theme.palette.text.secondary,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <StoreIcon sx={{ fontSize: 16 }} />
              Thông tin nhà cung cấp
            </Typography>

            <TextField
              fullWidth
              label="Tên nhà cung cấp"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              placeholder="Nhập tên nhà cung cấp..."
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                  "&.Mui-focused": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.06),
                    boxShadow: `0 0 0 2px ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                  },
                },
                "& .MuiInputLabel-root": {
                  fontWeight: 500,
                },
              }}
              InputProps={{
                startAdornment: (
                  <StoreIcon
                    sx={{
                      mr: 1.5,
                      color: theme.palette.primary.main,
                      fontSize: 20,
                    }}
                  />
                ),
              }}
            />

            {/* Validation message */}
            {name.trim() && name.trim() === source?.name && (
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  color: theme.palette.warning.main,
                  display: "block",
                }}
              >
                Chưa có thay đổi nào
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <Divider sx={{ mx: 3 }} />

      <DialogActions sx={{ px: 3, py: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={isLoading}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            borderColor: alpha(theme.palette.grey[400], 0.8),
            color: theme.palette.text.secondary,
            "&:hover": {
              borderColor: theme.palette.grey[400],
              backgroundColor: alpha(theme.palette.grey[400], 0.08),
            },
          }}
        >
          Hủy bỏ
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveQuickEdit}
          disabled={isInvalid || isLoading}
          startIcon={isLoading ? null : <SaveIcon />}
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
        >
          {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSource;
