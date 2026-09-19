"use client";
//toastify
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// introjs
import "intro.js/introjs.css";

import OverrideMuiTheme from "@/theme/override";
import { Box } from "@mui/material";
import "./globals.css";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import LoadingRoot from "./loading";
const AuthProviderClientOnly = dynamic(
  () => import("@/context/AuthContext").then((mod) => mod.AuthProvider),
  { ssr: false }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProviderClientOnly>
          <OverrideMuiTheme>
            <Box>
              <Suspense fallback={<LoadingRoot />}>{children}</Suspense>
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
              />
            </Box>
          </OverrideMuiTheme>
        </AuthProviderClientOnly>
      </body>
    </html>
  );
}
