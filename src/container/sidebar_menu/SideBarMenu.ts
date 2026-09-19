import { Dashboard as DashboardIcon } from "@mui/icons-material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupIcon from "@mui/icons-material/Group";
import { MenuItem } from "@/types/MenuItemType";
import ListIcon from "@mui/icons-material/List";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import CategoryIcon from "@mui/icons-material/Category";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import StoreIcon from "@mui/icons-material/Store";

export const MenuItems: MenuItem[] = [
  {
    icon: DashboardIcon,
    label: "Bảng điều khiển",
    path: "/admin/dashboard",
    role: ["admin", "user"],
  },
  {
    icon: AllInboxIcon,
    label: "Đơn hàng",
    path: "/admin/manage_orders",
    role: ["admin", "user"],
  },
  {
    icon: GroupIcon,
    label: "Người dùng",
    path: "",
    children: [
      {
        icon: ListIcon,
        label: "Danh sách",
        path: "/admin/manage_users",
        role: ["admin"],
      },
    ],
  },
  {
    icon: CategoryIcon,
    label: "Loại sản phẩm",
    path: "/admin/manage_category",
    role: ["admin", "user"],
  },
  {
    icon: StoreIcon,
    label: "Nhà cung cấp",
    path: "/admin/manage_source",
    role: ["admin", "user"],
  },
  {
    icon: LocalGroceryStoreIcon,
    label: "Sản phẩm",
    path: "/admin/manage_product",
    role: ["admin", "user"],
  },
  {
    icon: LocalGroceryStoreIcon,
    label: "Quản lí sản phẩm",
    path: "",
    children: [
      {
        icon: ListIcon,
        label: "Quán lí nhập hàng",
        path: "/admin/batch_product",
        role: ["admin"],
      },
      {
        icon: ListIcon,
        label: "Nhập hàng",
        path: "/admin/import_product",
        role: ["admin"],
      },
    ],
  },
  {
    icon: CalendarMonthIcon,
    label: "Xuất excel",
    path: "/admin/export_excel",
    role: ["admin", "user"],
  },
];
