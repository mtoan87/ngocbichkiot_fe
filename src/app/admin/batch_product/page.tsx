import TableBatch from "@/container/ManageBatch/TableBatch";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý lô sản phẩm",
  description:
    "Trang quản trị để quản lý lô sản phẩm, bao gồm thêm, sửa và xóa lô sản phẩm.",
};

const BatchProductPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <main>
      <TableBatch />
    </main>
  );
};

export default BatchProductPage;
