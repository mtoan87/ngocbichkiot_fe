"use client";
import React from "react";
import userApi from "@/axios-clients/user_api/userAPI";
import CustomizeTable from "@/components/table/customize-table";
import { User } from "@/types/Usertype";
import { Box, Button, Grid2, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddUser from "./popup/AddUser";
import IntroTour from "@/components/intro/IntroTour";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import withAuth from "@/hook/checkRoute";

interface STProps {
  filter: any;
  setFilter: any;
}

const SearchTool: React.FC<STProps> = ({ filter, setFilter }) => {
  return (
    <Box sx={{ p: 2 }}>
      <TextField
        size="small"
        placeholder="Tìm kiếm"
        label="Khách hàng"
        id="intro-search-user"
        onChange={(e) => setFilter({ ...filter, SearchTerm: e.target.value })}
      />
    </Box>
  );
};

const userTableIntroSteps = [
  {
    element: "#intro-user-table",
    title: "Bảng đơn hàng",
    intro: "Đây là danh sách người dùng trong hệ thống.",
    position: "left",
  },
  {
    element: "#name-header",
    title: "Cột tên người dùng",
    intro: "Tên người dùng.",
    position: "right",
  },
  {
    element: "#email-header",
    title: "Cột email",
    intro: "Email của người dùng.",
    position: "left",
  },
  {
    element: "#phone-header",
    title: "Cột số điện thoại",
    intro: "Số điện thoại của người dùng.",
    position: "left",
  },
  {
    element: "#role-header",
    title: "Cột vai trò",
    intro: "Vai trò của người dùng trong hệ thống.",
    position: "left",
  },
  {
    element: "#status-header",
    title: "Cột trạng thái",
    intro: "Trạng thái hoạt động của người dùng.",
    position: "left",
  },
  {
    element: "#intro-search-user",
    title: "Thanh tìm kiếm",
    intro: "Nhập vào đây để tìm kiếm khách hàng",
    position: "right",
  },
  {
    element: "#intro-create-user",
    title: "Thêm người dùng",
    intro: "Nhấn vào đây để thêm người dùng mới.",
    position: "left",
  },
];

const ManageUserTable = () => {
  //define state
  const [usersData, setUsersData] = React.useState<User[]>();
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState({ SearchTerm: "" });
  const [selectedRow, setSelectedRow] = React.useState<any>(null);

  //call api
  const getListUsers = async () => {
    try {
      const data: any = await userApi.getListUsers({
        ...filter,
        pageIndex,
        pageSize,
        total,
      });
      setUsersData(data.items);
      setTotal(data.totalItemsCount);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };
  React.useEffect(() => {
    getListUsers();
  }, [pageIndex, pageSize, filter]);

  //select data
  const selecteData = (row: any) => {
    setSelectedRow(row);
  };

  //Handle pagination
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPageIndex(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageIndex(0);
  };

  //title header
  const tableHeaderTitle = [
    {
      id: "name",
      label: "Tên người dùng",
      align: "center",
      introId: "name-header",
    },
    { id: "email", label: "Email", align: "center", introId: "email-header" },
    {
      id: "phone",
      label: "Số điện thoại",
      align: "center",
      introId: "phone-header",
    },
    {
      id: "role.roleName",
      label: "Vai trò",
      align: "center",
      introId: "role-header",
    },
    {
      id: "status",
      label: "Trạng thái",
      align: "center",
      format: "status",
      introId: "status-header",
    },
  ];

  //handle open add popup
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const EventAction = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          id="intro-create-user"
          sx={(theme) => ({
            [theme.breakpoints.down("mobile")]: {
              fontSize: 10,
            },
          })}
        >
          Thêm người dùng
        </Button>
        <IntroTour
          steps={userTableIntroSteps}
          buttonContent={<InfoOutlinedIcon sx={{ cursor: "pointer" }} />}
        />
      </Box>
    );
  };
  return (
    <div>
      <AddUser open={open} handleClose={handleClose} fetchData={getListUsers} />
      <CustomizeTable
        data={usersData}
        searchTool={<SearchTool filter={filter} setFilter={setFilter} />}
        title="Danh sách người dùng"
        tableHeaderTitle={tableHeaderTitle}
        eventAction={<EventAction />}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        selectedData={selecteData}
        page={pageIndex}
        size={pageSize}
        total={total}
        tableContainerId="intro-user-table"
      />
    </div>
  );
};

export default withAuth(ManageUserTable);
