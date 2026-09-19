"use client";
import orderApi from "@/axios-clients/order_api/orderAPI";
import { OrderStatus } from "@/enum/OrderStatus";
import withAuth from "@/hook/checkRoute";
import { colors, font_weight } from "@/styles/config-file";
import { OrderDetailType } from "@/types/OrderDetailType";
import {
  Box,
  Chip,
  Grid2,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import moment from "moment";
import React, { useRef } from "react";
import { toast } from "react-toastify";

interface DetailOrderProps {
  orderId: string;
}

const DetailOrder: React.FC<DetailOrderProps> = ({ orderId }) => {
  //define state
  const [orderDetailData, setOrderDetailData] =
    React.useState<OrderDetailType>();
  const receiptRef = useRef<HTMLDivElement>(null);

  //call api to get order detail
  const getOrderDetail = async () => {
    try {
      const res: any = await orderApi.getOrderDetail(orderId);
      setOrderDetailData(res);
      console.log(res);
    } catch (error) {
      toast.error("Có lỗi xảy ra trong quá trình lấy chi tiết đơn hàng");
    }
  };

  React.useEffect(() => {
    getOrderDetail();
  }, []);

  //status format
  const statusFormat = (status?: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return (
          <Chip
            label="Chờ xử lý"
            sx={{
              bgcolor: colors.yellow_200,
              color: colors.yellow_800,
              fontWeight: font_weight.semiBold,
            }}
          />
        );
      case OrderStatus.FINISH:
        return (
          <Chip
            label="Đã thanh toán"
            sx={{
              bgcolor: colors.green_200,
              color: colors.green_800,
              fontWeight: font_weight.semiBold,
            }}
          />
        );
      case OrderStatus.CANCELED:
        return (
          <Chip
            label="Đã hủy"
            sx={{
              bgcolor: colors.red_200,
              color: colors.red_800,
              fontWeight: font_weight.semiBold,
            }}
          />
        );
      default:
        return "-";
    }
  };

  //Header title
  const headerTitle = [
    { id: 1, label: "#" },
    { id: 2, label: "Tên sản phẩm" },
    { id: 3, label: "Đơn giá" },
    { id: 4, label: "Số lượng" },
    { id: 5, label: "Thành tiền" },
  ];

  // Handle print function
  const handlePrint = () => {
    const content = receiptRef.current?.innerHTML;
    const printWindow = window.open("", "", "width=300,height=600");
    if (printWindow && content) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Order</title>
   <style>
  @media print {
    @page {
      size: auto;
      margin: 0;
    }
    body {
      margin: 0;
      padding: 0;
    }
  }

  body {
    font-family: monospace;
    font-size: 20px;
    width: 80mm;
    padding: 5mm;
    margin: 0;
  }

  .center { text-align: center; }
  .bold { font-weight: bold; }
  .line { margin: 4px 0; }

  .header-line {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    border-bottom: 1px solid #000;
    margin: 6px 0;
    padding-bottom: 4px;
  }

  .item-line {
    display: flex;
    justify-content: space-between;
    margin: 5px 0;
    font-size: 20px;
  }

  .item-number {
    width: 30px;
    flex-shrink: 0;
  }

  .item-name {
    flex: 1;
    padding-right: 10px;
    word-break: break-word;
  }

  .item-prices {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    width: 160px;
    flex-shrink: 0;
  }

  .quantity {
    width: 40px;
    text-align: center;
  }

  .unit-price {
    width: 60px;
    text-align: right;
  }

  .total-price {
    width: 60px;
    text-align: right;
  }

  .total-line {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 20px;
    margin: 6px 0;
  }
</style>
          </head>
          <body onload="window.print(); window.close();">
            ${content}
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Get status text for print
  const getStatusText = (status?: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "Chờ xử lý";
      case OrderStatus.FINISH:
        return "Đã thanh toán";
      case OrderStatus.CANCELED:
        return "Đã hủy";
      default:
        return "-";
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Hidden receipt content for printing */}
      <div ref={receiptRef} style={{ display: "none" }}>
        <div>
          <div className="center bold">CỬA HÀNG NGỌC BÍCH</div>
          <div className="center">Địa chỉ cửa hàng</div>
          <div className="center">=============================</div>
          <div className="center bold">HÓA ĐƠN BÁN HÀNG</div>
          <div className="line">
            Ngày:{" "}
            {moment(orderDetailData?.orderDate).format("DD/MM/YYYY HH:mm")}{" "}
          </div>
          <div className="line">
            Khách hàng: {orderDetailData?.name || "Toàn"}
          </div>
          <div className="center">=============================</div>

          {/* Table headers */}
          <div className="header-line">
            <span className="item-number"></span>
            <span className="item-name">Tên</span>
            <div className="item-prices">
              <span className="quantity">Số lượng</span>
              <span className="unit-price">Giá</span>
              <span className="total-price">Thành tiền</span>
            </div>
          </div>

          {/* Product items */}
          {orderDetailData?.orderDetails?.map((item, index) => (
            <div key={index} className="item-line">
              <span className="item-number">{index + 1}.</span>
              <span className="item-name">
                {item.product.name.length > 20
                  ? item.product.name.substring(0, 20) + "..."
                  : item.product.name}
              </span>
              <div className="item-prices">
                <span className="quantity">{item.quantity}</span>
                <span className="unit-price">
                  {item.unitPrice.toLocaleString("vi-VN")}
                </span>
                <span className="total-price">
                  {item.totalPrice.toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
          ))}

          <div className="center">=============================</div>
          <div className="total-line">
            <span>Tổng tiền sản phẩm:</span>
            <span>
              {orderDetailData?.orderDetails
                ?.reduce((total, item) => total + item.totalPrice, 0)
                .toLocaleString("vi-VN")}
            </span>
          </div>
          <div className="center">=============================</div>
          <div className="center">Cảm ơn quý khách và hẹn gặp lại!</div>
        </div>
      </div>

      <Stack spacing={4}>
        {/* Print Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            onClick={handlePrint}
            sx={{
              bgcolor: colors.primary,
              color: "white",
              "&:hover": {
                bgcolor: colors.blue_200,
              },
            }}
          >
            🖨️ In đơn hàng
          </Button>
        </Box>

        <Grid2 container spacing={3}>
          <Grid2 size={{ mobile: 12, desktop: 4 }}>
            <Paper
              component={Box}
              sx={{
                p: 2,
                borderRadius: 2,
              }}
            >
              <Stack spacing={4}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: font_weight.semiBold }}
                  >
                    Chi tiết đơn hàng
                  </Typography>
                  <Box>{statusFormat(orderDetailData?.orderStatus)}</Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Khách hàng:
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.grey_600 }}>
                    {orderDetailData?.name ?? "-"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Địa chỉ:
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.grey_600 }}>
                    {orderDetailData?.address ?? "-"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Số điện thoại:
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.grey_600 }}>
                    {orderDetailData?.phone ?? "-"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Ngày đặt hàng:
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.grey_600 }}>
                    {moment(orderDetailData?.orderDate).format("DD/MM/YYYY") ??
                      "-"}
                  </Typography>
                </Box>
                {orderDetailData?.orderStatus === OrderStatus.FINISH && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Phương thức thanh toán:
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.grey_600 }}>
                      {orderDetailData?.paymentMethod ?? "-"}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid2>
          <Grid2 size={{ mobile: 12, desktop: 8 }}>
            <Box style={{ backgroundColor: colors.bgCardColor }}>
              <Paper
                component={Box}
                sx={{
                  p: 2,
                }}
              >
                <TableContainer>
                  <Table
                    sx={{ minWidth: 650, borderRadius: 4 }}
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        {headerTitle.map((item) => (
                          <TableCell
                            key={item.id}
                            align="left"
                            sx={{
                              fontWeight: font_weight.semiBold,
                              color: colors.dark,
                            }}
                          >
                            {item.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderDetailData?.orderDetails.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">{index + 1}</TableCell>
                          <TableCell align="left">{row.product.name}</TableCell>
                          <TableCell align="left">
                            {row.unitPrice.toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </TableCell>
                          <TableCell align="left">{row.quantity}</TableCell>
                          <TableCell align="left">
                            {row.totalPrice.toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Grid2>
        </Grid2>
      </Stack>
    </Box>
  );
};

export default withAuth(DetailOrder);
