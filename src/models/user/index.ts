export interface User {
  id: number;
  name: string;
  email: string;
  password: string | null;
  status: number;
  userType: string;
  deleteFlg: number;
  token: string | null;
  profileImage: string | null;
}