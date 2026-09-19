import ExcelExport from "@/container/export_excel/ExportExcel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xuất dữ liệu Excel",
  description: "Trang quản trị để xuất dữ liệu dưới dạng tệp Excel.",
};

const ExportExcelPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <main>
      <ExcelExport />
    </main>
  );
};

export default ExportExcelPage;
