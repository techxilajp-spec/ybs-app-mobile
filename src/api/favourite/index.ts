import { FAVORITE_KEY } from "@/src/types/favourite";
import { supabase } from "@/src/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Safely parses a JSON string into a TypeScript object.
 * @param value The JSON string to parse.
 * @param fallback The fallback value to return if parsing fails.
 * @returns The parsed object or the fallback value.
 */
const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

/**
 * Retrieves the list of favorite routes from AsyncStorage.
 * @returns The list of favorite routes.
 */
const getFavorites = async (): Promise<number[]> => {
  const json = await AsyncStorage.getItem(FAVORITE_KEY);
  return safeParse<number[]>(json, []);
};

export interface Route {
  routeId: number;
  routeName: string;
  routeNumberEn: string;
  routeColor: string;
  isYps: boolean;
  busStopNamesMm: string;
}

export type FavouriteRouteResponse = Route[];

/**
 * Retrieves the list of favorite routes from Supabase.
 * @returns The list of favorite routes.
 */
export const getFavoriteRoutes = async (): Promise<FavouriteRouteResponse> => {
  const favoriteIds = await getFavorites();
  if (!favoriteIds || favoriteIds.length === 0) return [];
  const { data, error } = await supabase
    .from("route_list_view")
    .select(`
      routeId,
      routeName,
      routeNumberEn,
      routeColor,
      isYps,
      busStopNamesMm
    `)
    .in("routeId", favoriteIds);
  if (error) {
    console.error("Error fetching favorite routes:", error);
    throw new Error(error.message);
  }
  return (data ?? []) as FavouriteRouteResponse;
};


/**
 * Adds a favorite route to AsyncStorage.
 * @param route The route to add.
 * @returns The updated list of favorite routes.
 */
const addFavorite = async (routeId: number) => {
  const favorites = await getFavorites();

  const exists = favorites.some((fav) => fav === routeId);

  if (!exists) {
    const updated = [...favorites, routeId];
    await AsyncStorage.setItem(FAVORITE_KEY, JSON.stringify(updated));
    return updated;
  }

  return favorites;
};

/**
 * Removes a favorite route from AsyncStorage.
 * @param route The route to remove.
 * @returns The updated list of favorite routes.
 */
const removeFavorite = async (routeId: number) => {
  const favorites = await getFavorites();
  const updated = favorites.filter((fav) => fav !== routeId);
  await AsyncStorage.setItem(FAVORITE_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * Checks if a route is favorited.
 * @param routeId The ID of the route to check.
 * @returns A promise that resolves to a boolean indicating whether the route is favorited.
 */
const isFavorite = async (routeId: number): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.some((fav) => fav.toString() === routeId.toString());
};

/**
 * Clears all favorite routes from AsyncStorage.
 * @returns An empty array.
 */
const clearFavorites = async () => {
  await AsyncStorage.removeItem(FAVORITE_KEY);
  return [];
};

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  clearFavorites,
  getFavoriteRoutes,
};


