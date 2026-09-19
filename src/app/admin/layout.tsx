"use client";
//toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Nav from "@/container/nav/Nav";

import { colors } from "@/styles/config-file";
import OverrideMuiTheme from "@/theme/override";
import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import LoadingAdminLayout from "./loading";

const AuthProviderClientOnly = dynamic(
  () => import("../../context/AuthContext").then((mod) => mod.AuthProvider),
  { ssr: false }
);

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthProviderClientOnly>
        <OverrideMuiTheme>
          <Box sx={{ display: "flex" }}>
            {/* <NavBar /> */}
            <Box width={"100%"}>
              <Nav />
              <Box
                sx={(theme) => ({
                  bgcolor: colors.white,

                  [theme.breakpoints.down("mobile")]: {
                    mt: 20,
                    p: 4,
                  },

                  [theme.breakpoints.between("mobile", "desktop")]: {
                    mt: 20,
                    p: 4,
                  },

                  [theme.breakpoints.up("desktop")]: {
                    mt: 18,
                    pl: 33,
                  },
                })}
              >
                <Suspense fallback={<LoadingAdminLayout />}>
                  {children}
                </Suspense>
                <ToastContainer
                  position="top-center"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
              </Box>
            </Box>
          </Box>
        </OverrideMuiTheme>
      </AuthProviderClientOnly>
    </>
  );
}
