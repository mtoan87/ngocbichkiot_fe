export interface MenuItem {
  icon?: any;
  label: string;
  path: string;
  children?: MenuItem[];
  role?: string[]; // Giữ lại role
}
