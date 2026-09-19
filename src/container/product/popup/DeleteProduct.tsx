import { Backdrop, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Stack, Typography } from "@mui/material";
import RestoreFromTrashOutlinedIcon from "@mui/icons-material/RestoreFromTrashOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { toast } from "react-toastify";
import productApi from "@/axios-clients/product_api/productAPI";

interface DeleteProductProps {
    product: any,
    open: boolean;
    handleClose: () => void;
    fetchData: () => void;
}
const DeleteProduct: React.FC<DeleteProductProps> = ({ open, product, handleClose, fetchData }) => {

    const handleDelete = async () => {
        try {
            await productApi.DeleteOrEnable(product.id, !product?.isDeleted ? 1 : 0);
            toast.success("Đổi trạng thái sản phẩm thành công");
            fetchData();
        } catch (error) {
            toast.error("Đổi trạng thái sản phẩm thất bại");
            console.error("Lỗi khi xoá/khôi phục sản phẩm:", error);
        } finally {
            handleClose();
        }
    };
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
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    {product.isDeleted ? (
                        <RestoreFromTrashOutlinedIcon color="success" fontSize="large" />
                    ) : (
                        <DeleteOutlinedIcon color="error" fontSize="large" />
                    )}
                    <Box>
                        <Typography variant="h6" fontWeight={600}>
                            {product.isDeleted
                                ? "Khôi phục sản phẩm"
                                : "Ngừng hoạt động sản phẩm"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {product.isDeleted
                                ? "Sản phẩm sẽ được kích hoạt lại"
                                : "Sản phẩm sẽ được ẩn khỏi hệ thống"}
                        </Typography>
                    </Box>
                </Stack>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                <Box
                    sx={{
                        p: 2,
                        backgroundColor: "#f8fafc",
                        borderRadius: 2,
                        border: "1px solid #e2e8f0",
                    }}
                >
                    <Typography variant="body1" textAlign="center">
                        Bạn có chắc chắn muốn{" "}
                        {product.isDeleted ? "khôi phục" : "ngừng hoạt động"} sản phẩm{" "}
                        <Typography component="span" fontWeight={600} color="primary">
                            "{product.name}"
                        </Typography>{" "}
                        này không?
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                >
                    Hủy
                </Button>
                <Button
                    onClick={handleDelete}
                    variant="contained"
                    color={product.isDeleted ? "success" : "error"}
                    sx={{ borderRadius: 2 }}
                >
                    {product.isDeleted ? "Khôi phục" : "Xác nhận"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteProduct;