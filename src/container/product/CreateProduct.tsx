"use client";

import { CreateProductFormInput } from "@/types/ProductType";
import React, { useCallback } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Grid2,
  Paper,
  Typography,
} from "@mui/material";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFTextFieldNumber,
} from "@/components/hook_form";
import productApi from "@/axios-clients/product_api/productAPI";
import { toast } from "react-toastify";
import {
  RHFUploadMultiFile,
  RHFUploadSingleFile,
} from "@/components/text_field";
import uploadImageToFirebase from "@/firebase/uploadImageToFirebase";
import { Category } from "@/types/CategoryType";
import categoryApi from "@/axios-clients/category_api/categoryAPI";
import withAuth from "@/hook/checkRoute";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Tên sản phẩm là bắt buộc"),
  categoryId: Yup.number().required("Loại là bắt buộc"),
  sellingPrice: Yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        const normalized = originalValue.replace(/,/g, "");
        return parseFloat(normalized);
      }
      return value;
    })
    .typeError("Phải là số")
    .required("Giá bán là bắt buộc"),
  userName: Yup.string().required("Tên người dùng là bắt buộc"),
  importCosts: Yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        const normalized = originalValue.replace(/,/g, "");
        return parseFloat(normalized);
      }
      return value;
    })
    .typeError("Phải là số")
    .required("Giá nhập là bắt buộc"),
  stockQuantity: Yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        const normalized = originalValue.replace(/,/g, "");
        return parseFloat(normalized);
      }
      return value;
    })
    .typeError("Phải là số")
    .required("Số lượng tồn là bắt buộc"),
  unit: Yup.string().required("Đơn vị là bắt buộc"),
  status: Yup.string().required("Trạng thái là bắt buộc"),
  productImages: Yup.array()
    .min(1, "Images is required")
    .required("Ảnh là bắt buộc"),
  // productImages: Yup.mixed().required("Cover is required"),
});
const capitalizedWords = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const CreateProduct = () => {
  const router = useRouter();
  const [categories, setCategories] = React.useState<Category[]>([]);

  const methods = useForm<CreateProductFormInput>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      categoryId: 0,
      sellingPrice: 0,
      userName: "",
      importCosts: 0,
      stockQuantity: 0,
      unit: "",
      status: "Available",
      productImages: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = methods;

  const values = watch();

  // nhiều hình
  const handleDropImage = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (acceptedFiles: any) => {
      const images = values.productImages || [];

      const uploadedImages = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        acceptedFiles.map(async (file: any) => {
          const downloadURL = await uploadImageToFirebase(file);
          return downloadURL;
        })
      );

      setValue("productImages", [...images, ...uploadedImages]);
    },
    [setValue, values.productImages]
  );

  const handleRemoveAll = () => {
    setValue("productImages", []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.productImages?.filter(
      (_file) => _file !== file
    );
    setValue("productImages", filteredItems);
  };

  //   dùng cho 1 hình
  //  const handleDrop = useCallback(
  //    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //    async (acceptedFiles: any[]) => {
  //      const file = acceptedFiles[0];

  //      const coverImage = await uploadImageToFirebase(file);
  //      if (typeof coverImage === "string") {
  //        setValue("productImages", coverImage);
  //      }
  //    },
  //    [setValue]
  //  );

  // call api get categories
  React.useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await categoryApi.getCategoryActive();
        setCategories(res.items);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách loại sản phẩm:", error);
      }
    };

    getCategories();
  }, []);

  const onSubmit = async (data: CreateProductFormInput) => {
    try {
      await productApi.CreateProduct(data);
      toast.success("Nhập sản phẩm thành công");
      router.push("/admin/manage_product");
    } catch (error) {
      toast.error("Nhập sản phẩm thất bại");
      console.error("Nhập sản phẩm thất bại:", error);
    }
  };
  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography
          sx={{ fontSize: { xs: "2rem", md: "1.5rem" }, fontWeight: 500 }}
          gutterBottom
        >
          Nhập sản phẩm mới
        </Typography>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <RHFTextField
                name="name"
                label="Tên sản phẩm"
                placeholder="Nhập tên sản phẩm"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <RHFSelect name="categoryId" label="Loại sản phẩm">
                <option value={0}>Chọn loại sản phẩm</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </RHFSelect>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <RHFTextFieldNumber
                name="importCosts"
                label="Giá nhập"
                placeholder="Giá nhập từ nhà cung cấp"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <RHFTextFieldNumber
                name="sellingPrice"
                label="Giá bán"
                placeholder="Ví dụ: 120000"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <RHFTextField
                name="unit"
                label="Đơn vị"
                placeholder="VD: chiếc, hộp, kg..."
                onBlur={(e) => {
                  const formatted = capitalizedWords(e.target.value);
                  setValue("unit", formatted, { shouldValidate: true });
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <RHFTextField
                name="userName"
                label="Người nhập"
                placeholder="Tên nhân viên nhập hàng"
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <RHFUploadMultiFile
                name="productImages"
                showPreview
                label="Ảnh sản phẩm"
                onDrop={handleDropImage}
                onRemove={handleRemove}
                onRemoveAll={handleRemoveAll}
              />
              {/* <RHFUploadSingleFile
                name="productImages"
                label="Ảnh sản phẩm"
                onDrop={handleDrop}
              /> */}
            </Grid2>
          </Grid2>

          <Box
            mt={4}
            display="flex"
            flexDirection={{ xs: "column", lg: "row" }}
            justifyContent="flex-end"
            alignItems="center"
            gap={2}
          >
            <Button
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{
                width: { xs: "100%", sm: "auto" },
                order: { xs: 1, lg: 2 },
              }}
            >
              {isSubmitting ? "Đang tạo..." : "Nhập sản phẩm"}
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.push("/admin/manage_product")}
              sx={{
                borderColor: "secondary.main",
                color: "secondary.main",
                ":hover": {
                  backgroundColor: (theme) => theme.palette.secondary.light,
                  borderColor: "secondary.dark",
                  color: "white",
                },
                width: { xs: "100%", sm: "auto" },
                order: { xs: 2, lg: 1 },
              }}
            >
              Quay lại
            </Button>
          </Box>
        </FormProvider>
      </Paper>
    </Container>
  );
};
export default withAuth(CreateProduct);