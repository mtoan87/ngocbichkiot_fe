interface Role {
  id: number;
  roleName: string;
}

interface Image {
  id: number;
  urlPath: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // Password có thể không bắt buộc trong một số trường hợp
  phone: string;
  address: string;
  status: "Active" | "Inactive" | string; // Sử dụng union type cho các giá trị status có thể
  role: Role;
  images: Image[];
}

// // Ví dụ sử dụng type alias (tương đương với interface trong trường hợp này)
// export type UserType = {
//   id: number;
//   name: string;
//   email: string;
//   password?: string;
//   phone: string;
//   address: string;
//   status: "Active" | "Inactive" | string;
//   role: Role;
//   images: Image[];
// };
