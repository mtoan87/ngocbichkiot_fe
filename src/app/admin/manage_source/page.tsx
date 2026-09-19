import SourceTable from "@/container/sourceOfProduct/sourceTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý nguồn sản phẩm",
  description:
    "Trang quản trị để quản lý nguồn sản phẩm, bao gồm thêm, sửa và xóa nguồn.",
};

const ManageSourcePage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div>
      <SourceTable />
    </div>
  );
};

export default ManageSourcePage;
