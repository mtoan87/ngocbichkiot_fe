"use client";

import React from "react";
import { useRouter } from "next/navigation";

// MUI
import { Box, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// library
import { toast } from "react-toastify";

// Components
import CustomizeTable from "@/components/table/customize-table";
import IntroTour from "@/components/intro/IntroTour";
import MenuActionTableProduct from "../menu_action/Product/MenuActionProduct";

// Hooks & API
import useDebounce from "@/hook/useDebounce";
import productApi from "@/axios-clients/product_api/productAPI";

// Types
import { Product } from "@/types/ProductType";
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
        id="search-order"
        onChange={(e) => setFilter({ ...filter, SearchTerm: e.target.value })}
      />
    </Box>
  );
};

const productTableIntroSteps = [
  {
    element: "#intro-product-table",
    title: "Bảng sản phẩm",
    intro: "Đây là danh sách các sản phẩm.",
    position: "left",
  },
  {
    element: "#image-header",
    title: "Cột Hình ảnh",
    intro: "Hình ảnh sản phẩm.",
    position: "right",
  },
  {
    element: "#name-header",
    title: "Cột tên sản phẩm",
    intro: "Tên sản phẩm.",
    position: "left",
  },
  {
    element: "#selling-price-header",
    title: "Cột Giá bán",
    intro: "Giá bán của sản phẩm.",
    position: "left",
  },
  {
    element: "#unit-header",
    title: "Cột Đơn vị",
    intro: "Đơn vị của sản phẩm.",
    position: "left",
  },
  {
    element: "#date-header",
    title: "Cột Ngày tạo",
    intro: "Ngày tạo của sản phẩm.",
    position: "left",
  },
  {
    element: "#deleted-header",
    title: "Cột Trạng thái",
    intro: "Trạng thái của sản phẩm.",
    position: "left",
  },
  {
    element: "#menu-action",
    title: "Nút hành động",
    intro: "Nhấn vào đây để thực hiện các hành động trên sản phẩm đã chọn.",
    position: "left",
  },
  {
    element: "#search-order",
    title: "Thanh tìm kiếm",
    intro: "Nhập vào đây để tìm kiếm sản phẩm",
    position: "right",
  },
  {
    element: "#create-order-btn",
    title: "Tạo sản phẩm",
    intro: "Nhấn vào đây để thêm sản phẩm mới.",
    position: "left",
  },
];

const ProductTable = () => {
  //Define the state for products
  const [products, setProducts] = React.useState<Product[]>([]);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [totalItemsCount, setTotalItemsCount] = React.useState<number>(0);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  const router = useRouter();
  const [filter, setFilter] = React.useState<any>({ SearchTerm: "" });
  const debounce = useDebounce(filter, 0);

  //Call the API to get the products
  const getProducts = async () => {
    try {
      const res: any = await productApi.getProductList({
        ...filter,
        pageIndex,
        pageSize,
        totalItemsCount,
      });
      setProducts(res.items);
      setTotalItemsCount(res.totalItemsCount);
    } catch (error) {
      toast.error("Lấy sản phẩm thất bại");
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  React.useEffect(() => {
    getProducts();
  }, [pageIndex, pageSize, debounce]);

  //select data
  const selectedData = (row: any) => {
    setSelectedRow(row);
  };

  const navigateDetail = (row: any) => {
    router.push(`/admin/manage_product/${row.id}/detail`);
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
      id: "images",
      label: "Hình ảnh",
      align: "center",
      format: "images",
      introId: "image-header",
    },
    {
      id: "name",
      label: "Tên sản phẩm",
      align: "center",
      introId: "name-header",
    },
    //{ id: "category", label: "Loại", align: "center" },
    //{ id: "sourceOfProducts", label: "Nguồn nhập", align: "center" },
    {
      id: "sellingPrice",
      label: "Giá bán",
      align: "center",
      format: "price",
      introId: "selling-price-header",
    },
    //{ id: "importCosts", label: "Giá nhập", align: "center", format: "price", introId: "import-costs-header" },
    { id: "unit", label: "Đơn vị", align: "center", introId: "unit-header" },
    {
      id: "createDate",
      label: "Ngày tạo",
      align: "center",
      format: "date",
      introId: "date-header",
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
          id="create-order-btn"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => router.push("/admin/manage_product/create")}
        >
          Tạo sản phẩm
        </Button>
        <IntroTour
          steps={productTableIntroSteps}
          buttonContent={<InfoOutlinedIcon sx={{ cursor: "pointer" }} />}
        />
      </Box>
    );
  };

  const menuAction = (
    <MenuActionTableProduct
      product={selectedRow}
      isDeleted={selectedRow?.isDeleted as boolean}
      fetchProduct={getProducts}
      introId="menu-action"
    />
  );
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
        selectedData={(row: Product) => setSelectedRow(row)}
        data={products}
        title="Danh sách sản phẩm"
        tableContainerId="intro-product-table"
        onRowClick={navigateDetail}
      />
    </div>
  );
};
export default withAuth(ProductTable);
