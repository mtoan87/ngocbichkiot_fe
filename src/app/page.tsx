import Dashboard from "@/container/dashboard/Dashboard";
import React from "react";
import type { Metadata } from "next";
import Authenticate from "@/container/auth/authenticate";

export const metadata: Metadata = {
  title: "Trang chủ | Đăng nhập",
  description: "Trang chủ của ứng dụng, nơi người dùng có thể đăng nhập.",
};

const Home = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <main>
      <Authenticate />
    </main>
  );
};

export default Home;
