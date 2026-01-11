import { FAVORITE_KEY, favouriteRouteRequest } from "@/src/types/favourite";
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
}

/**
 * Retrieves the list of favorite routes from AsyncStorage.
 * @returns The list of favorite routes.
 */
const getFavorites = async (): Promise<favouriteRouteRequest[]> => {
  const json = await AsyncStorage.getItem(FAVORITE_KEY);

  return safeParse<favouriteRouteRequest[]>(json, []);
};

/**
 * Adds a favorite route to AsyncStorage.
 * @param route The route to add.
 * @returns The updated list of favorite routes.
 */
const addFavorite = async (route: favouriteRouteRequest) => {
  const favorites = await getFavorites();

  const exists = favorites.some((fav) => fav.routeId === route.routeId);

  if (!exists) {
    const updated = [...favorites, route];
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
const removeFavorite = async (route: favouriteRouteRequest) => {
  const favorites = await getFavorites();

  const updated = favorites.filter((fav) => fav.routeId !== route.routeId);

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
  return favorites.some((fav) => fav.routeId === routeId);
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
};
