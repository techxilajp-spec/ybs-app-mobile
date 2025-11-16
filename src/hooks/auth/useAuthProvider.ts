import { User } from "@/src/models/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const AUTH_KEY = "user_token";
export const USER_KEY = "user";

export function useAuthProvider() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // is logged in
  const [user, setUser] = useState<User | null>(null); // user's information
  const [loading, setLoading] = useState(true); // loading for login status check

  /**
   * set user
   * @param user user's information
   */
  const asyncSetUser = async (user: User) => {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    setUser(user);
  };

  /**
   * login
   * @param token user's token
   * @param user user's information 
   */
  const login = async (token: string, user: User) => {
    try {
      await AsyncStorage.setItem(AUTH_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      setIsLoggedIn(true);
      setUser(user);
    } catch (error) {
      console.error("Failed to store login token:", error);
      throw error;
    }
  };

  /**
   * logout
   */
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      setIsLoggedIn(false);
      setUser(null);
    } catch (e) {
      console.error("Failed to remove login token:", e);
    }
  };

  /**
   * check login status
   */
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem(AUTH_KEY);
        const user = await AsyncStorage.getItem(USER_KEY);
        setIsLoggedIn(Boolean(userToken));
        if (user) {
          setUser(JSON.parse(user));
        }
      } catch (e) {
        console.error("Failed to read login token:", e);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  return {
    isLoggedIn,
    loading,
    login,
    logout,
    user,
    asyncSetUser,
  };
}