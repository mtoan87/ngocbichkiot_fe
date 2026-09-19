"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
    Container,
    Paper,
    Typography,
    Grid2,
    Box,
    Button,
    MenuItem,
} from "@mui/material";


import productApi from "@/axios-clients/product_api/productAPI";
import { EditProductFormInput, Product, ProductImage } from "@/types/ProductType";
import {
    FormProvider,
    RHFSelect,
    RHFTextField,
    RHFTextFieldNumber,
} from "@/components/hook_form";
import { toast } from "react-toastify";
import { RHFUploadMultiFile } from "@/components/text_field";
import uploadImageToFirebase from "@/firebase/uploadImageToFirebase";
import withAuth from "@/hook/checkRoute";
import { set } from "date-fns";

const productStatusOptions = [
    { value: "", label: "Chọn trạng thái" },
    { value: "Available", label: "Còn hàng" },
    { value: "OutOfStock", label: "Hết hàng" },
    { value: "Incoming", label: "Hàng về" },
    { value: "Discontinued", label: "Ngừng" },
    { value: "PendingApproval", label: "Phê duyệt" },
    { value: "Damaged", label: "Hư hỏng" },
    { value: "Expired", label: "Hết hạn" },
];

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Tên sản phẩm là bắt buộc"),
    categoryId: Yup.number()
        .typeError("Phải là số")
        .required("Danh mục sản phẩm là bắt buộc"),
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
    unit: Yup.string().required("Đơn vị là bắt buộc"),
    status: Yup.string().required("Trạng thái là bắt buộc"),
    productImages: Yup.array()
        .min(1, "Images is required")
        .required("Ảnh là bắt buộc"),
    // productImages: Yup.mixed().required("Cover is required"),
});

const EditProduct = ({ id }: { id: string }) => {
    const router = useRouter();
    const methods = useForm<EditProductFormInput>({
        resolver: yupResolver(validationSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            categoryId: 0,
            sellingPrice: 0,
            importCosts: 0,
            unit: "",
            status: "",
            productImages: [],
        },
    });

    const {
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productApi.getProductById(id);
                console.log(data);
                reset({
                    ...data,
                    productImages: data.images?.map((img) => img.urlPath) || [],
                });
            } catch (error) {
                toast.error("Lấy thông tin sản phẩm thất bại");
                console.error("Lỗi khi lấy sản phẩm:", error);
            }
        };

        if (id) fetchProduct();
    }, [id, reset]);

    const onSubmit = async (data: EditProductFormInput) => {
        try {
            //console.log(data)
            await productApi.UpdateProduct(id, data);
            toast.success("Cập nhật sản phẩm thành công");
            router.push(`/admin/manage_product/${id}/detail`);
        } catch (error) {
            toast.error("Cập nhật sản phẩm thất bại");
            console.error("Cập nhật sản phẩm thất bại:", error);
        }
    };
    const values = watch();
    const handleDropImage = React.useCallback(
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

    return (
        <Container maxWidth="md" sx={{ my: 2 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Chỉnh sửa sản phẩm
                </Typography>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <RHFTextField name="name" label="Tên sản phẩm" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <RHFTextField name="importCosts" label="Giá nhập" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <RHFTextField name="sellingPrice" label="Giá bán" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <RHFSelect name="status" label="Trạng thái">
                                {productStatusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </RHFSelect>
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
                            disabled={isSubmitting}
                            sx={{
                                width: { xs: "100%", sm: "auto" },
                                order: { xs: 1, lg: 2 },
                            }}
                        >
                            {isSubmitting ? "Đang cập nhật..." : "Lưu thay đổi"}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => router.push(`/admin/manage_product/${id}/detail`)}
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
}
export default withAuth(EditProduct);