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
  Grid2,
  IconButton,
  Paper,
  Typography,
  Divider,
  Card,
  CardContent,
  Chip,
  Fade,
  Stack,
} from "@mui/material";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "@/axios-clients/user_api/userAPI";
import { User } from "@/types/Usertype";

interface CreateOrderProps {
  open: boolean;
  handleClose: () => void;
  fetchData: () => void;
}

interface OrderDetailForm {
  productId: number;
  quantity: number;
}

interface CreateOrderForm {
  orderDetails: OrderDetailForm[];
}

interface userInformationType {
  name: string;
  phone: string;
  address: string;
}

const CreateOrder: React.FC<CreateOrderProps> = ({
  open,
  handleClose,
  fetchData,
}) => {
  // Define state
  const [listProduct, setListProduct] = React.useState<Product[]>([]);

  // Define default values
  const defaultValues: CreateOrderForm = {
    orderDetails: [
      {
        productId: 0,
        quantity: 1,
      },
    ],
  };

  // Call api to get list product
  const getListProduct = async () => {
    try {
      const res: any = await productApi.getAvailableProductList({
        pageIndex: 0,
        pageSize: 100,
      });
      setListProduct(res.items);
    } catch (error) {
      toast.error("Có lỗi xảy ra trong quá trình lấy danh sách sản phẩm");
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  // Call api to get list user

  React.useEffect(() => {
    getListProduct();
  }, []);

  // Yup validation schema
  const orderDetailSchema = Yup.object().shape({
    productId: Yup.number()
      .required("Vui lòng chọn sản phẩm")
      .min(1, "Sản phẩm không hợp lệ"),
    quantity: Yup.number()
      .required("Vui lòng nhập số lượng")
      .min(1, "Số lượng phải lớn hơn 0"),
  });

  const validationSchema = Yup.object().shape({
    orderDetails: Yup.array()
      .of(orderDetailSchema)
      .min(1, "Vui lòng chọn ít nhất một sản phẩm"),
  });

  // Handle submit
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    getValues,
    watch,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "orderDetails",
  });

  const createOrder = async (data: any) => {
    console.log("Dữ liệu đơn hàng:", data);
    try {
      const res = await orderApi.createOrder(data);
      console.log("Phản hồi từ API:", res);
      toast.success("Tạo đơn hàng thành công");
      handleClose();
      fetchData();
    } catch (error: any) {
      toast.error("Tạo đơn hàng thất bại");
      console.error("Lỗi tạo đơn hàng:", error.response?.data || error.message);
    }
  };

  //func add field product
  const handleAddProduct = () => {
    append({ productId: 0, quantity: 1 });
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
      <FormProvider methods={methods} onSubmit={handleSubmit(createOrder)}>
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
                Tạo đơn hàng
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: colors.originPrimary,
                    fontWeight: 600,
                  }}
                >
                  <ShoppingCartIcon />
                  Danh sách sản phẩm
                </Typography>
                <Chip
                  label={`${fields.length} sản phẩm`}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              <Stack spacing={2}>
                {fields.map((item, index) => (
                  <Card
                    key={item.id}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        boxShadow: 2,
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Grid2 container spacing={2} alignItems="center">
                        <Grid2 size={0.5}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              backgroundColor: colors.originPrimary,
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",
                              fontSize: "0.875rem",
                            }}
                          >
                            {index + 1}
                          </Box>
                        </Grid2>
                        <Grid2 size={7.5}>
                          <RHFSelect
                            name={`orderDetails.${index}.productId`}
                            label="Sản Phẩm"
                            fullWidth
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          >
                            <option value={0}>Chọn sản phẩm</option>
                            {listProduct?.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </RHFSelect>
                        </Grid2>
                        <Grid2 size={3}>
                          <RHFTextField
                            name={`orderDetails.${index}.quantity`}
                            label="Số lượng"
                            type="number"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Grid2>
                        <Grid2 size={1}>
                          <IconButton
                            onClick={() => remove(index)}
                            color="error"
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(244, 67, 54, 0.1)",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s ease",
                            }}
                            disabled={fields.length === 1}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Grid2>
                      </Grid2>
                    </CardContent>
                  </Card>
                ))}
              </Stack>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button
                  onClick={handleAddProduct}
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 600,
                    borderColor: colors.originPrimary,
                    color: colors.originPrimary,
                    "&:hover": {
                      backgroundColor: `${colors.originPrimary}10`,
                      borderColor: colors.originPrimary,
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Thêm sản phẩm
                </Button>
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
              {isSubmitting ? "Đang tạo..." : "Tạo đơn hàng"}
            </Button>
          </Stack>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default CreateOrder;
