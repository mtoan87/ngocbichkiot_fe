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
  Chip,
  InputAdornment,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import categoryApi from "@/axios-clients/category_api/categoryAPI";
import { colors, font_weight } from "@/styles/config-file";

interface CreateCategoryProps {
  open: boolean;
  handleClose: () => void;
  fetchData: () => void;
}

const CreateCategory: React.FC<CreateCategoryProps> = ({
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
      case "Category already exists.":
        return "Loại sản phẩm đã tồn tại.";
      default:
        if (message) return message;
        if (error.response?.status === 500)
          return "Lỗi máy chủ. Vui lòng thử lại sau.";
        if (error.request) return "Không nhận được phản hồi từ máy chủ.";
        return "Đã xảy ra lỗi. Vui lòng thử lại.";
    }
  };

  const handleSaveQuickCreate = async () => {
    setLoading(true);
    try {
      await categoryApi.createCategory({ name });
      setName("");
      toast.success("Tạo thành công", {
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

  const handleCloseDialog = () => {
    if (!loading) {
      setName("");
      handleClose();
    }
  };

  const isInvalid = !name.trim();

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
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
      {/* Header with gradient background */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.originPrimary} 0%, ${colors.originPrimary}cc 100%)`,
          color: colors.white,
          position: "relative",
        }}
      >
        <DialogTitle
          sx={{
            color: "white",
            pb: 2,
            pr: 6,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.common.white, 0.15),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <CategoryOutlinedIcon sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ color: "white" }}>
                Tạo loại sản phẩm mới
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: alpha(theme.palette.common.white, 0.8) }}
              >
                Thêm loại sản phẩm vào danh mục
              </Typography>
            </Box>
          </Stack>

          {/* Close button */}
          <IconButton
            onClick={handleCloseDialog}
            disabled={loading}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "white",
              backgroundColor: alpha(theme.palette.common.white, 0.1),
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
              },
              "&:disabled": {
                color: alpha(theme.palette.common.white, 0.5),
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      </Box>

      <DialogContent sx={{ px: 4, py: 3 }}>
        <Stack spacing={3}>
          {/* Info chip */}
          <Chip
            icon={<CategoryOutlinedIcon />}
            label="Tên loại sản phẩm phải là duy nhất"
            variant="outlined"
            size="small"
            sx={{
              alignSelf: "flex-start",
              borderColor: theme.palette.info.main,
              color: theme.palette.info.main,
              backgroundColor: alpha(theme.palette.info.main, 0.05),
            }}
          />

          {/* Input field */}
          <TextField
            fullWidth
            label="Tên loại sản phẩm"
            placeholder="Nhập tên loại sản phẩm..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CategoryOutlinedIcon
                    sx={{
                      color: name
                        ? theme.palette.primary.main
                        : "action.active",
                      transition: "color 0.2s ease",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "&.Mui-focused": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderWidth: 2,
                  },
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.palette.primary.main,
              },
            }}
            helperText={
              name.trim()
                ? `Độ dài: ${name.trim().length} ký tự`
                : "Vui lòng nhập tên loại sản phẩm"
            }
            FormHelperTextProps={{
              sx: {
                color: name.trim()
                  ? theme.palette.success.main
                  : theme.palette.text.secondary,
                fontSize: "0.75rem",
              },
            }}
          />
        </Stack>
      </DialogContent>

      <Divider sx={{ mx: 3 }} />

      <DialogActions sx={{ px: 4, py: 3, gap: 2 }}>
        <Button
          onClick={handleCloseDialog}
          variant="outlined"
          disabled={loading}
          size="large"
          sx={{
            borderRadius: 2,
            minWidth: 100,
            textTransform: "none",
            fontWeight: 500,
            borderColor: theme.palette.grey[300],
            color: theme.palette.text.secondary,
            "&:hover": {
              borderColor: theme.palette.grey[400],
              backgroundColor: alpha(theme.palette.grey[500], 0.05),
            },
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveQuickCreate}
          disabled={isInvalid || loading}
          size="large"
          startIcon={loading ? undefined : <AddIcon />}
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
          {loading ? "Đang tạo..." : "Tạo mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCategory;
