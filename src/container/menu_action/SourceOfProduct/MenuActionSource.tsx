//'use client';

import React from 'react';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import BlockIcon from "@mui/icons-material/Block";
import { Button, Menu, MenuItem } from '@mui/material';
import EditSource from '@/container/sourceOfProduct/popup/EditSource';
import DeleteSource from '@/container/sourceOfProduct/popup/DeleteSource';

export default function MenuActionTableSource({
    source,
    isDeleted,
    introId,
    fetchSource,
}: {
    source: any;
    isDeleted: boolean;
    introId?: string;
    fetchSource: () => void;
}) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);

    const actions = [
        ...(!isDeleted
            ? [{
                label: "Chỉnh sửa",
                icon: <EditIcon sx={{ mr: 1, color: "#9ADE7B" }} />,
                action: () => {
                    setOpenEditDialog(true);
                },
            }]
            : []),
        {
            label: isDeleted === true ? "Khôi phục" : "Ngừng",
            icon: isDeleted === true ? (<AddIcon sx={{ mr: 1 }} color='success' />) : (<BlockIcon sx={{ mr: 1 }} color='error' />),
            action: () => {
                setOpenDeleteDialog(true);
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
                <MoreHorizIcon sx={{
                    color: "#6464CD",
                }} />
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
                    <MenuItem key={index}
                        onClick={() => {
                            action.action();
                            handleClose();
                        }}>
                        {action.icon}
                        <span>{action.label}</span>
                    </MenuItem>
                ))}
            </Menu>
            {openEditDialog == true && (
                <EditSource
                    open={openEditDialog}
                    handleClose={handleCloseEdit}
                    source={source}
                    fetchData={fetchSource}
                />
            )}
            {openDeleteDialog == true && (
                <DeleteSource
                    open={openDeleteDialog}
                    handleClose={handleCloseDelete}
                    source={source}
                    fetchData={fetchSource}
                />
            )}
        </div>
    );
}
