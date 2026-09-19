/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfirmOrder from "@/container/order/popup/ConfirmOrder";
import UpdateOrder from "@/container/order/popup/UpdateOrder";
import { OrderStatusType } from "@/enum/OrderStatus";
import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import DoneIcon from '@mui/icons-material/Done';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { redirect } from "next/navigation";
import * as React from "react";

interface MenuActionOrderProps {
  orderData: any;
  onOpenUpdate?: any;
  onOpenDetail?: any;
  onOpenDelete?: any;
  introId?: string;
  fetchData: () => void;
}

const MenuActionOrder: React.FC<MenuActionOrderProps> = ({
  orderData,
  onOpenUpdate,
  onOpenDetail,
  onOpenDelete,
  introId,
  fetchData,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [openDetail, setOpenDetail] = React.useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = React.useState<boolean>(false);
  const [openDelete, setOpenDelete] = React.useState<boolean>(false);
  const [openAssign, setOpenAssign] = React.useState<boolean>(false);
  const [openConfirm, setOpenConfirm] = React.useState<boolean>(false);
  const [selectedType, setSelectedType] = React.useState<string>("");
  const open = Boolean(anchorEl);

  //func
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    setOpenUpdate(true);
    setAnchorEl(null);
  };
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleDetail = () => {
    setOpenDetail(true);
    setAnchorEl(null);
    redirect(`/admin/manage_orders/${orderData.id}/order_detail`);
  };

  const handleDelete = () => {
    onOpenDelete(orderData);
    setOpenDelete(true);
    setAnchorEl(null);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleConfirm = (type: OrderStatusType) => {
    setSelectedType(type);
    setOpenConfirm(true);
    setAnchorEl(null);
  }
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  }

  const menuConfig: Record<OrderStatusType, React.JSX.Element[]> = {
    Pending: [
      <MenuItem key="update" onClick={handleUpdate}>
        <EditIcon sx={{ mr: "4px", color: "#9ADE7B" }} />
        <span>Cập nhật</span>
      </MenuItem>,
      <MenuItem key="prepared" onClick={() => handleConfirm("Prepared")}>
        <DoneIcon sx={{ mr: "4px", color: "#1976D2" }} />
        <span>Đã chuẩn bị</span>
      </MenuItem>,
      <MenuItem key="cancel" onClick={() => handleConfirm("Canceled")}>
        <BlockIcon sx={{ mr: "4px" }} color="error" />
        <span>Hủy</span>
      </MenuItem>,
    ],
    Prepared: [
      <MenuItem key="finish" onClick={() => handleConfirm("Finish")}>
        <DoneIcon sx={{ mr: "4px" }} color="success" />
        <span>Hoàn thành</span>
      </MenuItem>,
      <MenuItem key="cancel" onClick={() => handleConfirm("Canceled")}>
        <BlockIcon sx={{ mr: "4px" }} color="error" />
        <span>Hủy</span>
      </MenuItem>,
    ],
    Finish: [],
    Canceled: [],
  };

  const renderMenuItems = () => {
    const commonItems = [
      <MenuItem key="detail" onClick={handleDetail}>
        <InfoIcon sx={{ mr: "4px" }} color="info" />
        <span>Chi Tiết</span>
      </MenuItem>,
    ];
    const status = orderData?.orderStatus as OrderStatusType;
    const statusItems = menuConfig[status] || [];
    return [...commonItems, ...statusItems];
  };

  return (
    <div>
      <Button
        id={introId}
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ width: "20px" }}
      >
        <MoreHorizIcon
          sx={{
            color: "#6464CD",
          }}
        />
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {renderMenuItems()}
      </Menu>
      {/* {openDetail == true && (
        <DetailPopup
          handleOpen={openDetail}
          handleClose={handleCloseDetail}
          orderData={orderData}
        />
      )} */}

      {openUpdate == true && (
        <UpdateOrder
          open={openUpdate}
          handleClose={handleCloseUpdate}
          orderData={orderData}
          fetchData={fetchData}
        />
      )}
      {/* {openDelete == true && (
        <DeleteUser
          onOpen={openDelete}
          onClose={handleCloseDelete}
          data={orderData}
          fetchData={fetchData}
        />
      )} */}
      {openConfirm == true && (
        <ConfirmOrder
          type={selectedType}
          onOpen={openConfirm}
          handleClose={handleCloseConfirm}
          data={orderData}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default MenuActionOrder;
