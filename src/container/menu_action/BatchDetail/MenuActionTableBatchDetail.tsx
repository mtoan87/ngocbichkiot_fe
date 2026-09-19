//'use client';
import React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InfoIcon from "@mui/icons-material/Info";
import { Button, Menu, MenuItem } from "@mui/material";
import UpdateStockPopup from "@/container/ManageBatch/popup/UpdateStockPopup";

export default function MenuActionTableBatchDetail({
  batchData,
  isDeleted,
  introId,
  onOpenDetail,
  fetchData,
}: {
  batchData: any;
  isDeleted?: boolean;
  introId?: string;
  onOpenDetail?: any;
  fetchData: () => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);

  const actions = [
    {
      label: "Cập nhật số lượng",
      icon: <InfoIcon sx={{ mr: 1 }} color="info" />,
      action: () => {
        setOpenEditDialog(true);
      },
    },
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.currentTarget;
    setTimeout(() => {
      setAnchorEl(target);
    }, 0);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseDelete = () => {
    setOpenDeleteDialog(!openDeleteDialog);
  };
  const handleCloseEdit = () => {
    setOpenEditDialog(!openEditDialog);
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
        id="long-menu"
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
        {actions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              action.action();
              handleClose();
            }}
          >
            {action.icon}
            <span>{action.label}</span>
          </MenuItem>
        ))}
      </Menu>

      {openEditDialog && (
        <UpdateStockPopup
          batchData={batchData}
          open={openEditDialog}
          handleClose={handleCloseEdit}
          fetchData={fetchData}
        />
      )}
    </div>
  );
}
