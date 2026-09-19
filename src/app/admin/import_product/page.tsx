import ImportProduct from "@/container/ImportProduct/ImportProduct";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nhập sản phẩm",
  description: "Trang quản trị để nhập sản phẩm từ tệp CSV hoặc Excel.",
};

const ImportProductPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <main>
      <ImportProduct />
    </main>
  );
};

export default ImportProductPage;
