import { api } from "./ApiService";

// --- Public Routes ---
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
};

// --- Private Routes ---
export const privateApi = {
  getUserProfile: () => api.get("/user/profile"),
};
