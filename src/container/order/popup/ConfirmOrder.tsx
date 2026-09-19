'use client';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useState } from "react";
import { OrderStatusType } from "@/enum/OrderStatus";
import orderApi from "@/axios-clients/order_api/orderAPI";
import { toast } from "react-toastify";

interface ConfirmOrderProps {
    data: any;
    type: OrderStatusType;
    onOpen: boolean;
    handleClose: () => void;
    fetchData: () => void;
}

const confirmTextByStatus: Record<OrderStatusType, { title: string; content: string }> = {
    Prepared: {
        title: "Xác nhận đơn hàng đã chuẩn bị xong?",
        content: "Bạn có chắc chắn đơn hàng đã chuẩn bị xong!",
    },
    Finish: {
        title: "Xác nhận đơn hàng đã thanh toán?",
        content: "Vui lòng chọn phương thức thanh toán cho đơn hàng này.",
    },
    Canceled: {
        title: "Xác nhận huỷ đơn hàng?",
        content: "Bạn có chắc chắn muốn huỷ đơn hàng này!",
    },
};

const paymentMethods = [
    { label: "Thanh toán khi nhận hàng (COD)", value: "COD" },
    // { label: "Chuyển khoản ngân hàng", value: "BANK" },
    // { label: "Ví điện tử", value: "WALLET" },
];

const ConfirmOrder: React.FC<ConfirmOrderProps> = ({ type, onOpen, data, handleClose, fetchData }) => {
    const [paymentMethod, setPaymentMethod] = useState<string>("");

    const handleConfirm = async () => {
        try {
            if (type === "Finish" && !paymentMethod) {
                toast.warn("Vui lòng chọn phương thức thanh toán");
                return;
            }

            const statusActionMap: Record<OrderStatusType, () => Promise<any>> = {
                Prepared: () => orderApi.updateOrderStatus(data.id, { orderStatus: "Prepared" }),
                Canceled: () => orderApi.updateOrderStatus(data.id, { orderStatus: "Canceled" }),
                Finish: () => orderApi.checkOut(data.id, paymentMethod),
            };

            const action = statusActionMap[type];
            if (!action) throw new Error("Không tìm thấy hành động phù hợp");

            await action();
            toast.success("Cập nhật trạng thái đơn hàng thành công");
            fetchData();
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
            toast.error("Lỗi khi cập nhật trạng thái đơn hàng");
        } finally {
            handleClose();
        }
    };

    return (
        <Dialog
            open={onOpen}
            onClose={handleClose}
            disableEnforceFocus
            disableAutoFocus
        >
            <DialogTitle sx={{ color: 'red' }}>
                {confirmTextByStatus[type]?.title || "Xác nhận hành động?"}
            </DialogTitle>

            <DialogContent sx={{ minWidth: 400 }}>
                <Typography sx={{ mb: 2 }}>
                    {confirmTextByStatus[type]?.content || "Bạn có chắc chắn muốn thực hiện hành động này?"}
                </Typography>

                {type === "Finish" && (
                    <FormControl fullWidth>
                        <InputLabel id="payment-method-label">Phương thức thanh toán</InputLabel>
                        <Select
                            labelId="payment-method-label"
                            value={paymentMethod}
                            label="Phương thức thanh toán"
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            {paymentMethods.map((method) => (
                                <MenuItem key={method.value} value={method.value}>
                                    {method.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={handleClose}>Hủy</Button>
                <Button
                    onClick={handleConfirm}
                    color="primary"
                    variant="contained"
                    disabled={type === "Finish" && !paymentMethod}>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmOrder;
