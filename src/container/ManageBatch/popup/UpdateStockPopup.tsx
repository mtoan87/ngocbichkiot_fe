"use client";
import productApi from "@/axios-clients/product_api/productAPI";
import orderApi from "@/axios-clients/order_api/orderAPI";
import {
  FormProvider,
  RHFAutoComplete,
  RHFSelect,
  RHFTextField,
} from "@/components/hook_form";
import { colors, font_weight } from "@/styles/config-file";
import { Product } from "@/types/ProductType";
import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import BatchAPI from "@/axios-clients/batch_api/batchAPI";

interface UpdateStockPopupProps {
  batchData: any;
  open: boolean;
  handleClose: () => void;
  fetchData: () => void;
}

interface CreateOrderForm {
  batchId: string;
  quantity: number;
  type: string;
  name: string;
}

const UpdateStockPopup: React.FC<UpdateStockPopupProps> = ({
  batchData,
  open,
  handleClose,
  fetchData,
}) => {
  // Define state

  // Define default values
  const defaultValues: CreateOrderForm = {
    batchId: batchData?.id,
    quantity: 1,
    type: "Export",
    name: "",
  };

  const validationSchema = Yup.object().shape({
    batchId: Yup.string().required("Batch ID is required"),
    quantity: Yup.number()
      .required("Quantity is required")
      .min(0, "Quantity must be at least 0"),
    type: Yup.string().required("Type is required"),
    name: Yup.string().required("Name is required"),
  });

  // Handle submit
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const UpdateBatchDetailWhenCanNotSoldOut = async (data: any) => {
    const params = {
      batchId: data.batchId,
      quantity: data.quantity,
      type: data.type,
    };
    const body = {
      name: data.name,
    };
    try {
      const res = await BatchAPI.UpdateBatchDetailWhenCanNotSoldOut(
        body,
        params
      );
      console.log("Phản hồi từ API:", res);
      toast.success("Cập nhật thành công");
      handleClose();
      fetchData();
    } catch (error: any) {
      toast.error("Cập nhật thất bại");
      console.error("Lỗi tạo đơn hàng:", error.response?.data || error.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(UpdateBatchDetailWhenCanNotSoldOut)}
      >
        {/* Enhanced Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${colors.originPrimary} 0%, ${colors.originPrimary}cc 100%)`,
            color: colors.white,
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <ShoppingCartIcon sx={{ fontSize: 28 }} />
              <DialogTitle
                sx={{
                  p: 0,
                  fontSize: "1.5rem",
                  fontWeight: font_weight.regular,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Cập nhật số lượng (Xuất do hết hạn)
              </DialogTitle>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{
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
          </Box>
        </Box>

        <DialogContent sx={{ p: 0, maxHeight: "70vh", overflowY: "auto" }}>
          <Box sx={{ p: 3 }}>
            {/* Customer Information Section */}

            {/* Products Section */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: colors.grey_200,
                border: "1px solid #e9ecef",
                borderRadius: 2,
                // maxHeight: "500px",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Thông tin sản phẩm
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Tên sản phẩm: {batchData?.productDTO?.name}
                </Typography>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Đơn giá: {batchData?.productDTO?.sellingPrice}
                </Typography>
                <RHFTextField
                  name="quantity"
                  label="Số lượng cần xuất"
                  sx={{ mb: 2 }}
                />

                <RHFTextField name="name" label="Tên người xuất" />
              </Box>
            </Paper>
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3, backgroundColor: "#fafafa" }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ width: "100%", justifyContent: "flex-end" }}
          >
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                px: 4,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: colors.originPrimary,
                "&:hover": {
                  backgroundColor: colors.originPrimary,
                  transform: "translateY(-1px)",
                  boxShadow: 3,
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                },
                transition: "all 0.2s ease",
              }}
            >
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </Stack>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default UpdateStockPopup;
