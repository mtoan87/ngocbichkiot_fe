// components/withAuth.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface WithAuthProps {
  requireAuth?: boolean; // true: cần đăng nhập, false: không cần đăng nhập
  redirectTo?: string; // route để redirect
}

function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  options: WithAuthProps = { requireAuth: true, redirectTo: "/" }
) {
  return function AuthComponent(props: T) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
      const checkAuth = () => {
        try {
          // Kiểm tra xem localStorage có khả dụng không
          if (typeof window === "undefined") {
            setIsLoading(false);
            return;
          }

          // Kiểm tra token từ localStorage
          const token = localStorage.getItem("userInfor");

          setHasToken(!!token);
          setIsLoading(false);

          if (options.requireAuth) {
            // Cần đăng nhập nhưng không có token -> redirect login
            if (!token) {
              router.push(options.redirectTo || "/");
              return;
            }
          } else {
            // Không cần đăng nhập nhưng có token -> redirect dashboard
            if (token) {
              router.push("/admin/dashboard");
              return;
            }
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [router, options.requireAuth, options.redirectTo]);

    // Hiển thị loading khi đang kiểm tra
    if (isLoading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <p>Đang kiểm tra quyền truy cập...</p>
        </div>
      );
    }

    // Nếu requireAuth=true và không có token, không render component
    if (options.requireAuth && !hasToken) {
      return null;
    }

    // Nếu requireAuth=false và có token, không render component
    if (!options.requireAuth && hasToken) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;
