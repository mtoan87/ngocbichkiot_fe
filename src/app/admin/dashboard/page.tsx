import Dashboard from "@/container/dashboard/Dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bảng điều khiển",
  description:
    "Trang quản trị của ứng dụng, nơi quản trị viên có thể quản lý và theo dõi các hoạt động.",
};

const DashboardPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <main>
      <Dashboard />
    </main>
  );
};

export default DashboardPage;
