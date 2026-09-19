"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";
import { colors } from "@/styles/config-file";
import {
  Customer,
  DashboardData,
  MonthlyStats,
  Product,
} from "@/types/DashboardType";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import dashboardApi from "@/axios-clients/dashboard_api/dashboardAPI";
import IntroTour from "@/components/intro/IntroTour";
import { title } from "process";
import withAuth from "@/hook/checkRoute";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  backgroundColor: colors.bgCardColor || "#fff",
  overflow: "hidden",
}));

const CardHeader = styled(Box)(({ theme }) => ({
  padding: "16px 20px",
  borderBottom: "1px solid rgba(0,0,0,0.05)",
  marginBottom: "8px",
}));

const StatsCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  padding: "20px",
  "&:last-child": {
    paddingBottom: "20px",
  },
}));

// Format currency to VND
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

// Format month names
const monthNames = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

// Custom chart colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// Statistics summary component
const StatsSummary: React.FC<{ dashboardData: DashboardData }> = ({
  dashboardData,
}) => {
  // Calculate summary statistics
  const totalRevenue = dashboardData?.revenueByYears?.reduce(
    (sum, item) => sum + item.totalRevenue,
    0
  );
  const totalOrders = dashboardData?.monthlyOrderStats?.reduce(
    (sum, item) => sum + item.orderCount,
    0
  );
  const totalProducts = dashboardData?.topSellingProducts?.reduce(
    (sum, item) => sum + item.totalQuantitySold,
    0
  );
  const totalCustomers = dashboardData?.topCustomers?.length;

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      color: "#0088FE",
    },
    { title: "Total Orders", value: totalOrders, color: "#00C49F" },
    { title: "Products Sold", value: totalProducts, color: "#FFBB28" },
    { title: "Customers", value: totalCustomers, color: "#FF8042" },
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid
          size={{ xs: 12, md: 3, sm: 6 }}
          key={index}
          id={`stat-${stat.title.toLowerCase().replace(/\s/g, "-")}`}
        >
          <StyledCard>
            <StatsCardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
              >
                <Avatar
                  sx={{ bgcolor: stat.color, width: 48, height: 48, mr: 2 }}
                ></Avatar>
                {stat.title && (
                  <Typography variant="h6" gutterBottom component="div">
                    {stat.title}
                  </Typography>
                )}
              </Box>
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {stat.value}
              </Typography>
            </StatsCardContent>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

// Top selling products chart
const TopSellingProductsChart: React.FC<{ products: Product[] }> = ({
  products,
}) => {
  const data = products.map((product) => ({
    name: product.productName,
    soLuongBan: product.totalQuantitySold,
    doanhThu: product.sellingPrice * product.totalQuantitySold,
    imageUrl: product.imageUrls?.[0],
  }));

  // Custom tick with larger product image
  const CustomXAxisTick = (props: any) => {
    const { x, y, payload, index } = props;
    const product = data[index];

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
          {payload.value}
        </text>
        {product && (
          <image
            x={-25} // Wider image positioning
            y={20}
            width={50} // Increased width
            height={50} // Increased height
            xlinkHref={product.imageUrl}
            style={{ objectFit: "contain" }}
          />
        )}
      </g>
    );
  };

  return (
    <StyledCard>
      <CardHeader>
        <Typography variant="h6" component="div">
          Sản phẩm bán chạy nhất
        </Typography>
      </CardHeader>
      <StatsCardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={<CustomXAxisTick />}
              height={80}
              tickMargin={10}
            />
            <YAxis yAxisId="left" orientation="left" stroke="#0088FE" />
            <YAxis yAxisId="right" orientation="right" stroke="#FF8042" />
            <Tooltip
              formatter={(value, name) => {
                if (name === "doanhThu") {
                  return [formatCurrency(value as number), "Doanh thu"];
                }
                if (name === "soLuongBan") {
                  return [value, "Số lượng bán"];
                }
                return [value, name];
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div
                      style={{
                        backgroundColor: "#fff",
                        padding: "12px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 8px",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {data.name}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <img
                          src={data.imageUrl}
                          alt={data.name}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "contain",
                          }} // Much larger image in tooltip
                        />
                      </div>
                      {payload.map((p, index) => (
                        <p
                          key={index}
                          style={{
                            margin: "5px 0",
                            color: p.color,
                            fontSize: "14px",
                          }}
                        >
                          {p.name === "Doanh thu"
                            ? `Doanh thu: ${formatCurrency(p.value as number)}`
                            : `Số lượng bán: ${p.value}`}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              payload={[
                { value: "Số lượng bán", type: "rect", color: "#0088FE" },
                { value: "Doanh thu", type: "rect", color: "#FF8042" },
              ]}
              verticalAlign="top"
              height={36}
            />
            <Bar
              name="Số lượng bán"
              dataKey="soLuongBan"
              fill="#0088FE"
              yAxisId="left"
            />
            <Bar
              name="Doanh thu"
              dataKey="doanhThu"
              fill="#FF8042"
              yAxisId="right"
            />
          </BarChart>
        </ResponsiveContainer>
      </StatsCardContent>
    </StyledCard>
  );
};

// Monthly revenue chart
const MonthlyRevenueChart: React.FC<{ monthlyStats: MonthlyStats[] }> = ({
  monthlyStats,
}) => {
  console.log(monthlyStats, " dữ liệu tháng");

  const data = monthlyStats.map((stat) => ({
    name: monthNames[stat.month - 1],
    donHang: stat.orderCount,
    doanhThu: stat.totalRevenue,
  }));

  console.log(data, " dữ liệu");

  return (
    <StyledCard>
      <CardHeader>
        <Typography variant="h6" component="div">
          Doanh thu tháng và tổng đơn hàng
        </Typography>
      </CardHeader>
      <StatsCardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#0088FE" />
            <YAxis yAxisId="right" orientation="right" stroke="#00C49F" />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Tổng doanh thu") {
                  return [formatCurrency(value as number), name];
                }
                return [value, name]; // "Số đơn hàng"
              }}
            />
            <Legend />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="donHang"
              stroke="#00C49F"
              activeDot={{ r: 8 }}
              name="Số đơn hàng"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="doanhThu"
              stroke="#0088FE"
              name="Tổng doanh thu"
            />
          </LineChart>
        </ResponsiveContainer>
      </StatsCardContent>
    </StyledCard>
  );
};

// Top customers column chart
const TopCustomersChart: React.FC<{ customers: Customer[] }> = ({
  customers,
}) => {
  const data = customers.map((customer) => ({
    name: customer.name,
    tieuThu: customer.totalSpent,
    soDonHang: customer.orderCount,
  }));

  return (
    <StyledCard>
      <CardHeader>
        <Typography variant="h6" component="div">
          Khách hàng đặt hàng nhiều
        </Typography>
      </CardHeader>
      <StatsCardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#0088FE" />
            <YAxis yAxisId="right" orientation="right" stroke="#00C49F" />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Tổng tiền tiêu")
                  return [formatCurrency(value as number), "Tổng tiêu"];
                return [value, "Số đơn hàng"];
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="tieuThu"
              name="Tổng tiền tiêu"
              fill="#0088FE"
            />
            <Bar
              yAxisId="right"
              dataKey="soDonHang"
              name="Tổng số đơn"
              fill="#00C49F"
            />
          </BarChart>
        </ResponsiveContainer>
      </StatsCardContent>
    </StyledCard>
  );
};

// Main Dashboard component
const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const dashBoardIntroSteps = [
    {
      element: "#summary-stats",
      title: "Tổng quan",
      intro: "Thống kê tổng quan cửa hàng.",
      position: "bottom",
    },
    {
      element: "#stat-total-revenue",
      title: "Tổng doanh thu",
      intro: "Tổng doanh thu của cửa hàng trong tháng.",
      position: "bottom",
    },
    {
      element: "#stat-total-orders",
      title: "Tổng số đơn hàng",
      intro: "Tổng số đơn hàng đã hoàn thành trong tháng.",
      position: "bottom",
    },
    {
      element: "#stat-products-sold",
      title: "Sản phẩm đã bán",
      intro: "Tổng số sản phẩm đã bán.",
      position: "bottom",
    },
    {
      element: "#stat-customers",
      title: "Tổng số khách hàng",
      intro: "Tổng số khách hàng đã mua hàng.",
      position: "bottom",
    },
    {
      element: "#monthly-revenue",
      title: "Doanh thu hàng tháng",
      intro: "Biểu đồ doanh thu hàng tháng.",
      position: "bottom",
    },
    {
      element: "#top-customers",
      title: "Khách hàng hàng đầu",
      intro: "Khách hàng hàng đầu theo doanh.",
      position: "bottom",
    },
    {
      element: "#top-products",
      title: "Sản phẩm bán chạy nhất",
      intro: "Sản phẩm bán chạy nhất theo số lượng.",
      position: "top",
    },
  ];
  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {
        const param = {
          year: 2025,
        };
        const response: any = await dashboardApi.dashboard(param);
        setDashboardData(response);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" color="error">
          Error loading dashboard data. Please try again later.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Bảng thống kê cửa hàng
          </Typography>

          <IntroTour
            steps={dashBoardIntroSteps}
            buttonContent={<InfoOutlinedIcon sx={{ cursor: "pointer" }} />}
          />
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          Sơ bộ về thống kê bán hàng của cửa hàng
        </Typography>
      </Box>

      {/* Summary Statistics */}
      <Box id="summary-stats" sx={{ mb: 4 }}>
        <StatsSummary dashboardData={dashboardData} />
      </Box>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Monthly Revenue Chart */}
        <Grid id="monthly-revenue" size={{ xs: 12, md: 12 }}>
          <MonthlyRevenueChart
            monthlyStats={dashboardData?.monthlyOrderStats}
          />
        </Grid>

        {/* Top Customers Pie Chart */}
        <Grid id="top-customers" size={{ xs: 12, md: 12 }}>
          <TopCustomersChart customers={dashboardData?.topCustomers} />
        </Grid>

        {/* Top Selling Products Chart */}
        <Grid id="top-products" size={{ xs: 12 }}>
          <TopSellingProductsChart
            products={dashboardData.topSellingProducts}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default withAuth(Dashboard);
