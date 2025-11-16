import { AUTH_KEY } from "@/src/hooks/auth/useAuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// --- Configuration ---
const API_URL = "https://dummy/api/v1";

// --- Axios Instance ---
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Save token
export const setAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(AUTH_KEY, token);
  } catch (error) {
    console.error("Failed to save token:", error);
  }
};

// Get token
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(AUTH_KEY);
    return token;
  } catch (error) {
    console.error("Failed to get token:", error);
    return null;
  }
};

// Remove token
export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_KEY);
  } catch (error) {
    console.error("Failed to remove token:", error);
  }
};

// --- Axios Interceptors ---

// Request Interceptor: Adds token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't override content-type for file uploads
    if (config.data instanceof FormData || config.data instanceof Blob) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handles errors + token refresh
api.interceptors.response.use(
  async (response) => {
    // If backend sends a new token in response header, save it
    const token = response.headers["x-auth-token"];
    if (token) {
      await setAuthToken(token);
    }
    return response;
  },
  async (error) => {
    // if (error.response) {
    //   const { config, status } = error.response;
    //   console.log(
    //     `[ERROR ${status}] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    //   );
    // } else {
    //   console.log(`[ERROR] No response received`, error.message);
    // }
    if (error.response?.status === 401) {
      await removeAuthToken();
      console.log("Authentication failed, token removed. Please log in again.");
    }
    return Promise.reject(error);
  }
);