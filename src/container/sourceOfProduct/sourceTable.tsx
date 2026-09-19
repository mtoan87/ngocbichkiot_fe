"use client";

import { Box, Button, TextField } from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import IntroTour from "@/components/intro/IntroTour";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CustomizeTable from "@/components/table/customize-table";
import useDebounce from "@/hook/useDebounce";
import { SourceOfProduct } from "@/types/SourceOfProduct";
import sourceOfProductApi from "@/axios-clients/source_of_product_api/sourceOfProductAPI";
import MenuActionTableSource from "../menu_action/SourceOfProduct/MenuActionSource";
import CreateSource from "./popup/CreateSource";
import withAuth from "@/hook/checkRoute";

interface SearchToolProps {
  filter: any;
  setFilter: any;
}

const SearchTool: React.FC<SearchToolProps> = ({ filter, setFilter }) => {
  return (
    <Box sx={{ p: 2 }}>
      <TextField
        label="Tìm kiếm"
        variant="outlined"
        size="small"
        id="search-source"
        onChange={(e) => setFilter({ ...filter, SearchTerm: e.target.value })}
      />
    </Box>
  );
};

const sourceTableIntroSteps = [
  {
    element: "#intro-source-table",
    title: "Bảng nhà cung cấp",
    intro: "Đây là danh sách nhà cung cấp.",
    position: "left",
  },
  {
    element: "#name-header",
    title: "Cột nhà cung cấp",
    intro: "Tên nhà cung cấp.",
    position: "left",
  },
  {
    element: "#deleted-header",
    title: "Cột Trạng thái",
    intro: "Trạng thái của nhà cung cấp.",
    position: "left",
  },
  {
    element: "#menu-action",
    title: "Nút hành động",
    intro: "Nhấn vào đây để thực hiện các hành động trên nhà cung cấp đã chọn.",
    position: "left",
  },
  {
    element: "#search-source",
    title: "Thanh tìm kiếm",
    intro: "Nhập vào đây để tìm kiếm nhà cung cấp",
    position: "right",
  },
  {
    element: "#create-source-btn",
    title: "Thêm nhà cung cấp",
    intro: "Nhấn vào đây để thêm nhà cung cấp mới.",
    position: "left",
  },
];
const SourceTable = () => {
  //Define the state for source of products
  const [sources, setSources] = React.useState<SourceOfProduct[]>([]);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [totalItemsCount, setTotalItemsCount] = React.useState<number>(0);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [filter, setFilter] = React.useState<any>({ SearchTerm: "" });
  const debounce = useDebounce(filter, 0);

  //Call the API to get source of products
  const getSourceList = async () => {
    try {
      const res: any = await sourceOfProductApi.getSourceList({
        ...filter,
        pageIndex,
        pageSize,
        totalItemsCount,
      });
      setSources(res.items);
      setTotalItemsCount(res.totalItemsCount);
    } catch (error) {
      toast.error("Lấy danh sách nhà cung cấp thất bại");
      console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
    }
  };

  React.useEffect(() => {
    getSourceList();
  }, [pageIndex, pageSize, debounce]);

  //select data
  const selectedData = (row: any) => {
    setSelectedRow(row);
  };

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

  const tableHeaderTitle = [
    {
      id: "name",
      label: "Nhà cung cấp",
      align: "center",
      introId: "name-header",
    },
    {
      id: "isDeleted",
      label: "Trạng thái",
      align: "center",
      format: "deleted",
      introId: "deleted-header",
    },
  ];

  const createSource = () => {
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
          id="create-source-btn"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Thêm nhà cung cấp
        </Button>
        <IntroTour
          steps={sourceTableIntroSteps}
          buttonContent={<InfoOutlinedIcon sx={{ cursor: "pointer" }} />}
        />
      </Box>
    );
  };

  const menuAction = (
    <MenuActionTableSource
      source={selectedRow}
      isDeleted={selectedRow?.isDeleted as boolean}
      fetchSource={getSourceList}
      introId="menu-action"
    />
  );

  const handleCloseCreate = () => {
    setOpenCreateDialog(!openCreateDialog);
  };
  return (
    <div>
      <CustomizeTable
        tableHeaderTitle={tableHeaderTitle}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        total={totalItemsCount}
        size={pageSize}
        page={pageIndex}
        searchTool={<SearchTool filter={filter} setFilter={setFilter} />}
        menuAction={menuAction}
        eventAction={createSource()}
        selectedData={(row: SourceOfProduct) => setSelectedRow(row)}
        data={sources}
        title="Danh sách nhà cung cấp"
        tableContainerId="intro-source-table"
      />
      {openCreateDialog == true && (
        <CreateSource
          open={openCreateDialog}
          handleClose={handleCloseCreate}
          fetchData={getSourceList}
        />
      )}
    </div>
  );
};
export default withAuth(SourceTable);
