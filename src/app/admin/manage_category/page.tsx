import CategoryTable from "@/container/category/CategoryTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý danh mục sản phẩm",
  description:
    "Trang quản trị để quản lý danh mục sản phẩm, bao gồm thêm, sửa và xóa danh mục.",
};

const ManageCategoryPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div>
      <CategoryTable />
    </div>
  );
};

export default ManageCategoryPage;
