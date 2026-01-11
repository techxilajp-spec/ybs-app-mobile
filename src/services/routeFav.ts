import { getDeviceId } from "@/src/utils/device";
import { supabase } from "@/src/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITE_KEY = "favorite_routes";

/* ---------- LOCAL ---------- */

export async function getRouteLocalFavorites(): Promise<string[]> {
  const json = await AsyncStorage.getItem(FAVORITE_KEY);
  return json ? JSON.parse(json) : [];
}

export async function setLocalFavorites(ids: string[]) {
  await AsyncStorage.setItem(FAVORITE_KEY, JSON.stringify(ids));
}

/* ---------- REMOTE ---------- */

export async function addFavoriteRemote(routeId: number) {
  const deviceId = await getDeviceId();
  const { error } = await supabase.from("favorite_routes").insert({
    device_id: deviceId,
    route_id: routeId,
  });
  if (error) {
    console.warn("addFavoriteRemote failed:", error.message);
  }
}

export async function removeFavoriteRemote(routeId: number) {
  const deviceId = await getDeviceId();

  const { error } = await supabase
    .from("favorite_routes")
    .delete()
    .match({ device_id: deviceId, route_id: routeId });

  if (error) {
    console.warn("removeFavoriteRemote failed:", error.message);
  }
}

/* ---------- SYNC ---------- */

// Local → Supabase
export async function syncFavoritesToSupabase() {
  const deviceId = await getDeviceId();
  const localIds = await getRouteLocalFavorites();

  if (localIds.length === 0) return;

  const payload = localIds
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id))
    .map((id) => ({
      device_id: deviceId,
      route_id: id,
    }));

  await supabase
    .from("favorite_routes")
    .upsert(payload, { onConflict: "device_id,route_id" });
}

// Supabase → Local
export async function syncFavoritesFromSupabase() {
  const deviceId = await getDeviceId();

  const { data } = await supabase
    .from("favorite_routes")
    .select("route_id")
    .eq("device_id", deviceId);

  if (!data) return;

  const ids = data.map((r) => r.route_id.toString());
  await setLocalFavorites(ids);
}
