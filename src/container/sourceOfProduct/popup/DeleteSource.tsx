import { Backdrop, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Stack, Typography } from "@mui/material";
import RestoreFromTrashOutlinedIcon from "@mui/icons-material/RestoreFromTrashOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { toast } from "react-toastify";
import sourceOfProductApi from "@/axios-clients/source_of_product_api/sourceOfProductAPI";

interface DeleteSourceProps {
    source: any,
    open: boolean;
    handleClose: () => void;
    fetchData: () => void;
}
const DeleteSource: React.FC<DeleteSourceProps> = ({ open, source, handleClose, fetchData }) => {

    const getErrorMessage = (error: any): string => {
        const message = error?.response?.data?.message;

        switch (message) {
            case "Cannot delete SourceOfProduct because it is in use by some products.":
                return "Không thể xoá nhà cung cấp vì nó đang được sử dụng bởi một số sản phẩm.";
            default:
                if (message) return message;
                if (error.response?.status === 500) return "Lỗi máy chủ. Vui lòng thử lại sau.";
                if (error.request) return "Không nhận được phản hồi từ máy chủ.";
                return "Đã xảy ra lỗi. Vui lòng thử lại.";
        }
    };

    const handleDelete = async () => {
        try {
            await sourceOfProductApi.deleteOrEnable(source.id, !source?.isDeleted ? 1 : 0);
            toast.success("Đổi trạng thái thành công");
            fetchData();
        } catch (error) {
            toast.error(getErrorMessage(error), { autoClose: 5000 });
            console.error("Lỗi khi xoá/khôi phục nhà cung cấp:", error);
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
                    {source.isDeleted ? (
                        <RestoreFromTrashOutlinedIcon color="success" fontSize="large" />
                    ) : (
                        <DeleteOutlinedIcon color="error" fontSize="large" />
                    )}
                    <Box>
                        <Typography variant="h6" fontWeight={600}>
                            {source.isDeleted
                                ? "Khôi phục nhà cung cấp"
                                : "Ngừng hoạt động nhà cung cấp"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {source.isDeleted
                                ? "Nhà cung cấp sẽ được kích hoạt lại"
                                : "Nhà cung cấp sẽ được ẩn khỏi hệ thống"}
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
                        {source.isDeleted ? "khôi phục" : "ngừng hoạt động"} nhà cung cấp{" "}
                        <Typography component="span" fontWeight={600} color="primary">
                            "{source.name}"
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
                    color={source.isDeleted ? "success" : "error"}
                    sx={{ borderRadius: 2 }}
                >
                    {source.isDeleted ? "Khôi phục" : "Xác nhận"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteSource;