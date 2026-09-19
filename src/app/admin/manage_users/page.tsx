import ManageUserTable from "@/container/user/ManageUserTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý người dùng",
  description:
    "Trang quản trị để quản lý người dùng, bao gồm xem, sửa và xóa người dùng.",
};

const ManageUserPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div>
      <ManageUserTable />
    </div>
  );
};

export default ManageUserPage;
