"use client";

import categoryApi from "@/axios-clients/category_api/categoryAPI";
import { Category } from "@/types/CategoryType";
import { Box, Button, TextField } from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import IntroTour from "@/components/intro/IntroTour";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CustomizeTable from "@/components/table/customize-table";
import MenuActionTableCategory from "../menu_action/Category/MenuActionCategory";
import CreateCategory from "./popup/CreateCategory";
import useDebounce from "@/hook/useDebounce";
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
        id="search-category"
        onChange={(e) => setFilter({ ...filter, SearchTerm: e.target.value })}
      />
    </Box>
  );
};

const categoryTableIntroSteps = [
  {
    element: "#intro-category-table",
    title: "Bảng loại sản phẩm",
    intro: "Đây là danh sách các loại sản phẩm.",
    position: "left",
  },
  {
    element: "#name-header",
    title: "Cột loại sản phẩm",
    intro: "Loại sản phẩm.",
    position: "left",
  },
  {
    element: "#deleted-header",
    title: "Cột Trạng thái",
    intro: "Trạng thái của loại sản phẩm.",
    position: "left",
  },
  {
    element: "#menu-action",
    title: "Nút hành động",
    intro:
      "Nhấn vào đây để thực hiện các hành động trên loại sản phẩm đã chọn.",
    position: "left",
  },
  {
    element: "#search-category",
    title: "Thanh tìm kiếm",
    intro: "Nhập vào đây để tìm kiếm loại sản phẩm",
    position: "right",
  },
  {
    element: "#create-category-btn",
    title: "Tạo loại sản phẩm",
    intro: "Nhấn vào đây để thêm loại sản phẩm mới.",
    position: "left",
  },
];
const CategoryTable = () => {
  //Define the state for categories
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [totalItemsCount, setTotalItemsCount] = React.useState<number>(0);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [filter, setFilter] = React.useState<any>({ SearchTerm: "" });
  const debounce = useDebounce(filter, 0);

  //Call the API to get the products
  const getCategories = async () => {
    try {
      const res: any = await categoryApi.getCategoryList({
        ...filter,
        pageIndex,
        pageSize,
        totalItemsCount,
      });
      setCategories(res.items);
      setTotalItemsCount(res.totalItemsCount);
    } catch (error) {
      toast.error("Lấy loại sản phẩm thất bại");
      console.error("Lỗi khi lấy danh sách loại sản phẩm:", error);
    }
  };

  React.useEffect(() => {
    getCategories();
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
      label: "Tên loại sản phẩm",
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

  const createProduct = () => {
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
          id="create-category-btn"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Tạo loại sản phẩm
        </Button>
        <IntroTour
          steps={categoryTableIntroSteps}
          buttonContent={<InfoOutlinedIcon sx={{ cursor: "pointer" }} />}
        />
      </Box>
    );
  };

  const menuAction = (
    <MenuActionTableCategory
      category={selectedRow}
      isDeleted={selectedRow?.isDeleted as boolean}
      fetchCategory={getCategories}
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
        eventAction={createProduct()}
        selectedData={(row: Category) => setSelectedRow(row)}
        data={categories}
        title="Danh sách loại sản phẩm"
        tableContainerId="intro-category-table"
      />
      {openCreateDialog == true && (
        <CreateCategory
          open={openCreateDialog}
          handleClose={handleCloseCreate}
          fetchData={getCategories}
        />
      )}
    </div>
  );
};
export default withAuth(CategoryTable);
