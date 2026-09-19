import React from "react";
import { Backdrop, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fade, FormControl, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import { toast } from "react-toastify";
import productApi from "@/axios-clients/product_api/productAPI";

interface EditProductProps {
    product: any,
    open: boolean;
    handleClose: () => void;
    fetchData: () => void;
}
const EditProduct: React.FC<EditProductProps> = ({ open, product, handleClose, fetchData }) => {
    const [name, setName] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [editType, setEditType] = React.useState<"Import" | "Export">("Import");
    const [editQuantity, setEditQuantity] = React.useState<number>(0);
    const [rawQuantity, setRawQuantity] = React.useState<string>("0");

    const handleSaveQuickEdit = async () => {
        try {
            await productApi.UpdateStock(product.id, editQuantity, editType, {
                name,
                phone,
                address,
            });
            setName("");
            setPhone("");
            setAddress("");
            setEditType("Import");
            setEditQuantity(0);
            setRawQuantity("0");
            toast.success("Cập nhật tồn kho thành công");
            handleClose();
            fetchData();
        } catch (error) {
            toast.error("Cập nhật tồn kho thất bại");
            console.error("Lỗi khi cập nhật tồn kho:", error);
        }
    };

    const isInvalid =
        !name.trim() || editQuantity <= 0;


    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        if (!/^\d*$/.test(value)) return;

        if (value.length > 1) {
            value = value.replace(/^0+/, "");
        }

        setRawQuantity(value);
        setEditQuantity(Number(value));
    };
    const hasExportError =
        editType === "Export" &&
        (product?.stockQuantity === 0 ||
            editQuantity > (product?.stockQuantity ?? 0));

    const exportHelperText =
        editType === "Export" && product
            ? product.stockQuantity === 0
                ? "Không thể xuất khi hết kho"
                : editQuantity > product.stockQuantity
                    ? `Số lượng xuất vượt quá tồn kho (${product.stockQuantity})`
                    : ""
            : "";


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
            <DialogTitle>
                <Typography variant="body1" fontWeight={600}>
                    Cập nhật tồn kho
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Tồn kho hiện tại: {product.stockQuantity} sản phẩm
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        label="Tên người thực hiện"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mt: 2 }}
                        InputProps={{
                            startAdornment: (
                                <PersonOutlineIcon sx={{ mr: 1, color: "action.active" }} />
                            ),
                        }}
                    />
                    <FormControl fullWidth>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Loại thao tác
                        </Typography>
                        <Select
                            value={editType}
                            onChange={(e) =>
                                setEditType(e.target.value as "Import" | "Export")
                            }
                            sx={{
                                borderRadius: 2,
                                "& .MuiSelect-select": {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                },
                            }}
                        >
                            <MenuItem value="Import">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <TrendingUpOutlinedIcon color="success" />
                                    <Typography>Nhập hàng</Typography>
                                </Stack>
                            </MenuItem>
                            <MenuItem value="Export">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <TrendingUpOutlinedIcon
                                        color="error"
                                        sx={{ transform: "rotate(180deg)" }}
                                    />
                                    <Typography>Xuất hàng</Typography>
                                </Stack>
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Số lượng"
                        type="text"
                        value={rawQuantity}
                        onChange={handleQuantityChange}
                        error={hasExportError}
                        helperText={exportHelperText}
                        InputProps={{
                            startAdornment: (
                                <InventoryOutlinedIcon
                                    sx={{ mr: 1, color: "action.active" }}
                                />
                            ),
                        }}
                    />
                </Stack>
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
                    variant="contained"
                    onClick={handleSaveQuickEdit}
                    disabled={isInvalid}
                    sx={{ borderRadius: 2 }}
                >
                    Lưu thay đổi
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditProduct;