import { RECENT_STOP_KEY } from "@/src/types/bus";
import { supabase } from "@/src/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Stop } from "@/src/types/bus";

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
 * Retrive the objec list of recent stops from supabase
 * @returns the list of recent sotps list
 */
const getRecents = async (): Promise<number[]> => {
  const json = await AsyncStorage.getItem(RECENT_STOP_KEY);
  return safeParse<number[]>(json, []);
};

/**
 * Retrives the list of the recent stops from supabase
 * @returns the list of recent stops
 */
const getRecentStops = async () : Promise<Stop[]> => {
  // retreive id from async storage
  const stopIds = await getRecents();
  if (stopIds.length === 0) return [];

  const { data, error } = await supabase.rpc("get_stops_by_ids", {
    stop_ids: stopIds,
  });

  if (error) throw error;

  // Sort data to match the order of stopIds (most recent first)
  const sortedData = (data ?? []).sort((a: any, b: any) => {
    return stopIds.indexOf(a.id) - stopIds.indexOf(b.id);
  });

  return sortedData;
};

/**
 * Adds a recent stop ro AsyncStorage
 * @param stop the stop to add.
 * @returns the updated list of recent sotps.
 */
const addRecent = async (stopId: number) => {
  const recents = await getRecents();

  // Filter out the stopId if it already exists to move it to the top
  const filteredRecents = recents.filter((id) => id !== stopId);

  // Prepend the new stopId to the beginning of the array
  const updated = [stopId, ...filteredRecents].slice(0, 10); // Keep last 10 recents

  await AsyncStorage.setItem(RECENT_STOP_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * Remove a last recent stop from AsyncStorage/
 * @param stop the stop to remove
 * @returns the updated list of revent stops
 */
const removeLastRecent = async (stopId: number) => {
  const recents = await getRecents();
  const updated = recents.filter((r) => r !== stopId);
  await AsyncStorage.setItem(RECENT_STOP_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * Checks if a stop is in the recent list
 * @param stopId The Id of the stop to check
 * @returns A promise the resolves to a boolean indicating whether the stop is favorited.
 */
const isRecent = async (stopId: number): Promise<boolean> => {
  const recents = await getRecents();
  return recents.some((r) => Number(r) === stopId);
};

export default {
  getRecentStops,
  addRecent,
  removeLastRecent,
  isRecent,
};
