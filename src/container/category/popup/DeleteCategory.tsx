import { Backdrop, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Stack, Typography } from "@mui/material";
import RestoreFromTrashOutlinedIcon from "@mui/icons-material/RestoreFromTrashOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { toast } from "react-toastify";
import categoryApi from "@/axios-clients/category_api/categoryAPI";

interface DeleteCategoryProps {
    category: any,
    open: boolean;
    handleClose: () => void;
    fetchData: () => void;
}
const DeleteCategory: React.FC<DeleteCategoryProps> = ({ open, category, handleClose, fetchData }) => {

    const getErrorMessage = (error: any): string => {
        const message = error?.response?.data?.message;

        switch (message) {
            case "Cannot delete category because it is in use by some products.":
                return "Không thể xoá loại sản phẩm vì đang được sử dụng bởi một số sản phẩm.";
            default:
                if (message) return message;
                if (error.response?.status === 500) return "Lỗi máy chủ. Vui lòng thử lại sau.";
                if (error.request) return "Không nhận được phản hồi từ máy chủ.";
                return "Đã xảy ra lỗi. Vui lòng thử lại.";
        }
    };

    const handleDelete = async () => {
        try {
            await categoryApi.deleteOrEnable(category.id, !category?.isDeleted ? 1 : 0);
            toast.success("Đổi trạng thái loại sản phẩm thành công");
            fetchData();
        } catch (error) {
            toast.error(getErrorMessage(error), { autoClose: 5000 });
            console.error("Lỗi khi xoá/khôi phục loại sản phẩm:", error);
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
                    {category.isDeleted ? (
                        <RestoreFromTrashOutlinedIcon color="success" fontSize="large" />
                    ) : (
                        <DeleteOutlinedIcon color="error" fontSize="large" />
                    )}
                    <Box>
                        <Typography variant="h6" fontWeight={600}>
                            {category.isDeleted
                                ? "Khôi phục loại sản phẩm"
                                : "Ngừng hoạt động loại sản phẩm"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {category.isDeleted
                                ? "Loại sản phẩm sẽ được kích hoạt lại"
                                : "Loại sản phẩm sẽ được ẩn khỏi hệ thống"}
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
                        Bạn có muốn{" "}
                        {category.isDeleted ? "khôi phục" : "ngừng hoạt động"} loại sản phẩm{" "}
                        <Typography component="span" fontWeight={600} color="primary">
                            "{category.name}"
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
                    color={category.isDeleted ? "success" : "error"}
                    sx={{ borderRadius: 2 }}
                >
                    {category.isDeleted ? "Khôi phục" : "Xác nhận"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteCategory;