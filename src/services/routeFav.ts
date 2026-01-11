import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITE_KEY = "favorite_routes";

export async function getRouteLocalFavorites(): Promise<string[]> {
  try {
    const json = await AsyncStorage.getItem(FAVORITE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.warn("getRouteLocalFavorites failed:", e);
    return [];
  }
}

export async function setLocalFavorites(ids: string[]) {
  try {
    await AsyncStorage.setItem(FAVORITE_KEY, JSON.stringify(ids));
  } catch (e) {
    console.warn("setLocalFavorites failed:", e);
  }
}

/* ---------- MUTATIONS ---------- */

export async function addFavorite(routeId: number | string) {
  const id = routeId.toString();
  const favorites = await getRouteLocalFavorites();

  if (!favorites.includes(id)) {
    favorites.push(id);
    await setLocalFavorites(favorites);
  }
}

export async function removeFavorite(routeId: number | string) {
  const id = routeId.toString();
  const favorites = await getRouteLocalFavorites();

  const updated = favorites.filter((fav) => fav !== id);
  await setLocalFavorites(updated);
}

/* ---------- HELPERS ---------- */

export async function isFavorite(routeId: number | string): Promise<boolean> {
  const id = routeId.toString();
  const favorites = await getRouteLocalFavorites();
  return favorites.includes(id);
}

export async function clearFavorites() {
  await AsyncStorage.removeItem(FAVORITE_KEY);
}
