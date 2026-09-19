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
  useTheme,
  alpha,
} from "@mui/material";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";
import categoryApi from "@/axios-clients/category_api/categoryAPI";

interface EditCategoryProps {
  category: any;
  open: boolean;
  handleClose: () => void;
  fetchData: () => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({
  open,
  category,
  handleClose,
  fetchData,
}) => {
  const theme = useTheme();
  const [name, setName] = React.useState(category.name || "");

  const getErrorMessage = (error: any): string => {
    const message = error?.response?.data?.message;

    switch (message) {
      case "Cannot update category because it is in use by some products.":
        return "Không thể cập nhật loại sản phẩm vì đang được sử dụng bởi một số sản phẩm.";
      default:
        if (message) return message;
        if (error.response?.status === 500)
          return "Lỗi máy chủ. Vui lòng thử lại sau.";
        if (error.request) return "Không nhận được phản hồi từ máy chủ.";
        return "Đã xảy ra lỗi. Vui lòng thử lại.";
    }
  };

  const handleSaveQuickEdit = async () => {
    try {
      await categoryApi.updateCategory(category.id, { name });
      setName("");
      toast.success("Cập nhật thành công");
      handleClose();
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error), { autoClose: 5000 });
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  const isInvalid = !name.trim();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 24,
        sx: {
          borderRadius: 3,
        },
      }}
    >
      {/* Header với gradient và close button */}
      <DialogTitle
        sx={{
          position: "relative",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          py: 2.5,
          borderRadius: "12px 12px 0 0",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.common.white, 0.15),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CategoryOutlinedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              Cập nhật loại sản phẩm
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{
              color: "white",
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider
        sx={{
          background: `linear-gradient(90deg, transparent 0%, ${theme.palette.primary.main} 50%, transparent 100%)`,
          height: 2,
        }}
      />

      {/* Content */}
      <DialogContent sx={{ px: 4, py: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, fontWeight: 500 }}
            >
              Thông tin loại sản phẩm
            </Typography>
            <TextField
              fullWidth
              label="Tên loại sản phẩm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                  "&.Mui-focused": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.06),
                    boxShadow: `0 0 0 3px ${alpha(
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mr: 1,
                      p: 0.5,
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    }}
                  >
                    <CategoryOutlinedIcon
                      sx={{
                        color: theme.palette.primary.main,
                        fontSize: 20,
                      }}
                    />
                  </Box>
                ),
              }}
            />
            {isInvalid && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 1, display: "block", fontWeight: 500 }}
              >
                Vui lòng nhập tên loại sản phẩm
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <Divider sx={{ mx: 3 }} />

      {/* Actions */}
      <DialogActions sx={{ px: 4, py: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          size="large"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            borderColor: alpha(theme.palette.primary.main, 0.3),
            color: theme.palette.primary.main,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
              transform: "translateY(-1px)",
              boxShadow: `0 4px 12px ${alpha(
                theme.palette.primary.main,
                0.15
              )}`,
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveQuickEdit}
          disabled={isInvalid}
          size="large"
          startIcon={<SaveIcon />}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
            "&:hover": {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              transform: "translateY(-2px)",
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
            "&:disabled": {
              background: alpha(theme.palette.action.disabled, 0.12),
              color: theme.palette.action.disabled,
              boxShadow: "none",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCategory;
