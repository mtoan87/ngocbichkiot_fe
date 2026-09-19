"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/ProductType";
import {
  Box,
  Button,
  Chip,
  Grid2,
  Typography,
  Card,
  CardContent,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RestoreFromTrashOutlinedIcon from "@mui/icons-material/RestoreFromTrashOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import productApi from "@/axios-clients/product_api/productAPI";
import ProductImageGallery from "./ProductImages";
import LogTable from "./LogTable";
import { toast } from "react-toastify";
import DeleteProduct from "./popup/DeleteProduct";
import EditProduct from "./popup/EditProduct";
import withAuth from "@/hook/checkRoute";
import BatchProductTable from "./BatchProductTable";

const DetailProduct = ({ id }: { id: string }) => {
  const [product, setProduct] = React.useState<Product | null>(null);
  const router = useRouter();
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const statusMap: Record<
    string,
    {
      label: string;
      color: "success" | "error" | "warning" | "info" | "default";
    }
  > = {
    Available: { label: "Còn hàng", color: "success" },
    OutOfStock: { label: "Hết hàng", color: "error" },
    Incoming: { label: "Hàng về", color: "info" },
    Discontinued: { label: "Ngừng", color: "default" },
    PendingApproval: { label: "Phê duyệt", color: "warning" },
    Damaged: { label: "Hư hỏng", color: "error" },
    Expired: { label: "Hết hạn", color: "error" },
  };

  const fetchProduct = async () => {
    try {
      const data: Product = await productApi.getProductById(id);
      console.log(data)
      if (data) {
        setProduct(data);
      }
    } catch (error) {
      toast.error("Lấy thông tin sản phẩm thất bại");
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  React.useEffect(() => {
    fetchProduct();
  }, []);

  if (!product) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography variant="h6" color="text.secondary">
          Đang tải thông tin sản phẩm...
        </Typography>
      </Box>
    );
  }
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(!openDeleteDialog);
  };
  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };
  const handleCloseEditDialog = () => {
    setOpenEditDialog(!openEditDialog);
    fetchProduct();
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          borderBottom: "1px solid #e2e8f0",
          px: 3,
          py: 2,
          zIndex: 10,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton
            onClick={() => router.push("/admin/manage_product")}
            sx={{
              backgroundColor: "#f1f5f9",
              "&:hover": { backgroundColor: "#e2e8f0" },
            }}
          >
            <ArrowBackOutlinedIcon />
          </IconButton>
          <Box flex={1}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Mã sản phẩm: #{id}
            </Typography>
          </Box>
          {!product.isDeleted && (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Chỉnh sửa sản phẩm">
                <Button
                  variant="outlined"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() =>
                    router.push(`/admin/manage_product/${id}/edit`)
                  }
                  sx={{ borderRadius: 3 }}
                >
                  Chỉnh sửa
                </Button>
              </Tooltip>
            </Stack>
          )}
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        <Grid2 container spacing={3}>
          {/* Images */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}
            >
              <CardContent>
                {product.images.length > 0 ? (
                  <ProductImageGallery images={product.images} />
                ) : (
                  <Box
                    sx={{
                      height: 400,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f1f5f9",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Chưa có hình ảnh
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid2>

          {/* Product Info */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              {/* Status & Category */}
              <Card
                elevation={0}
                sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Trạng thái & Danh mục
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={
                          statusMap[product.status]?.label || "Không xác định"
                        }
                        color={statusMap[product.status]?.color || "default"}
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                      <Chip
                        label={
                          product.isDeleted
                            ? "Không hoạt động"
                            : "Đang hoạt động"
                        }
                        color={product.isDeleted ? "error" : "success"}
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </Stack>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <CategoryOutlinedIcon color="action" />
                    <Typography variant="body1" color="text.secondary">
                      Danh mục:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {product.category.name}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card
                elevation={0}
                sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={3}>
                    Thông tin giá
                  </Typography>
                  <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: "#fff3e0" }}>
                          <TrendingUpOutlinedIcon />
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Chi phí nhập
                          </Typography>
                          <Typography variant="h6" fontWeight={600}>
                            {new Intl.NumberFormat("vi-VN").format(
                              product.importCosts
                            )}{" "}
                            VNĐ
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid2>
                    <Grid2 size={12}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: "#f3e5f5" }}>
                          <LocalOfferOutlinedIcon />
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="body2" color="text.secondary">
                            Giá bán
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            color="primary"
                          >
                            {new Intl.NumberFormat("vi-VN").format(
                              product.sellingPrice
                            )}{" "}
                            VNĐ
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid2>
                  </Grid2>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card
                elevation={0}
                sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}
              >
                <CardContent>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    color={product.isDeleted ? "success" : "error"}
                    startIcon={
                      product.isDeleted ? (
                        <RestoreFromTrashOutlinedIcon />
                      ) : (
                        <DeleteOutlinedIcon />
                      )
                    }
                    onClick={() => setOpenDeleteDialog(true)}
                    sx={{ borderRadius: 3, py: 1.5 }}
                  >
                    {product.isDeleted
                      ? "Khôi phục sản phẩm"
                      : "Ngừng hoạt động"}
                  </Button>
                </CardContent>
              </Card>
            </Stack>
          </Grid2>
        </Grid2>

        {/* Batch Section */}
        {product.batchDetails && product.batchDetails.length > 0 && (
          <Box mt={5}>
            <Card
              elevation={0}
              sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}
            >
              <CardContent>
                <BatchProductTable batchDetails={product.batchDetails} />
              </CardContent>
            </Card>
          </Box>
        )}


        {/* History Section */}
        {product.logs && product.logs.length > 0 && (
          <Box mt={5}>
            <Card
              elevation={0}
              sx={{ border: "1px solid #e2e8f0", borderRadius: 3 }}
            >
              <CardContent>
                <LogTable logs={product.logs} />
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>

      {/* Edit Dialog */}
      {openEditDialog == true && (
        <EditProduct
          open={openEditDialog}
          handleClose={handleCloseEditDialog}
          product={product}
          fetchData={fetchProduct}
        />
      )}

      {/* Delete Dialog */}
      {openDeleteDialog == true && (
        <DeleteProduct
          open={openDeleteDialog}
          handleClose={handleCloseDeleteDialog}
          product={product}
          fetchData={fetchProduct}
        />
      )}
    </Box>
  );
}
export default withAuth(DetailProduct);
