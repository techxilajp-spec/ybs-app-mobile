import { FAVORITE_STOP_KEY } from "@/src/types/favourite";
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
 * Retrieves the list of favorite stops from AsyncStorage.
 * @returns The list of favorite stops.
 */
const getFavorites = async (): Promise<number[]> => {
  const json = await AsyncStorage.getItem(FAVORITE_STOP_KEY);
  return safeParse<number[]>(json, []);
};

/**
 * Retrieves the list of favorite stops from Supabase.
 * @returns The list of favorite stops.
 */
const getFavoriteStops = async () => {
  const stopIds = await getFavorites();
  if (stopIds.length === 0) return [];

  const { data, error } = await supabase.rpc(
    "get_stops_by_ids",
    { stop_ids: stopIds }
  );

  if (error) throw error;
  return data ?? [];
};


/**
 * Adds a favorite stop to AsyncStorage.
 * @param stop The stop to add.
 * @returns The updated list of favorite stops.
 */
const addFavorite = async (stopId: number) => {
  const favorites = await getFavorites();
  const exists = favorites.some((fav) => fav === stopId);
  if (!exists) {
    const updated = [...favorites, stopId];
    await AsyncStorage.setItem(FAVORITE_STOP_KEY, JSON.stringify(updated));
    return updated;
  }
  return favorites;
};

/**
 * Removes a favorite stop from AsyncStorage.
 * @param stop The stop to remove.
 * @returns The updated list of favorite stops.
 */
const removeFavorite = async (stopId: number) => {
  const favorites = await getFavorites();
  const updated = favorites.filter((fav) => fav !== stopId);
  await AsyncStorage.setItem(FAVORITE_STOP_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * Checks if a stop is favorited.
 * @param stopId The ID of the stop to check.
 * @returns A promise that resolves to a boolean indicating whether the stop is favorited.
 */
const isFavorite = async (stopId: number): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.some((fav) => fav.toString() === stopId.toString());
};

/**
 * Clears all favorite stops from AsyncStorage.
 * @returns An empty array.
 */
const clearFavorites = async () => {
  await AsyncStorage.removeItem(FAVORITE_STOP_KEY);
  return [];
};

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  clearFavorites,
  getFavoriteStops,
};


