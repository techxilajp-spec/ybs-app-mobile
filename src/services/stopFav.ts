import { getDeviceId } from '@/src/utils/device';
import { supabase } from '@/src/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITE_KEY = 'favorite_stops';

/* ---------- LOCAL ---------- */

export async function getStopLocalFavorites(): Promise<string[]> {
    const json = await AsyncStorage.getItem(FAVORITE_KEY);
    return json ? JSON.parse(json) : [];
}

export async function setStopLocalFavorites(ids: string[]) {
    await AsyncStorage.setItem(FAVORITE_KEY, JSON.stringify(ids));
}

/* ---------- REMOTE ---------- */

export async function addFavoriteRemote(stopId: number) {
    console.log('addFavoriteRemote started');
    const deviceId = await getDeviceId();
    console.log('Device ID ................', deviceId);
    const { error } = await supabase
        .from('favorite_stops')
        .insert({
            device_id: deviceId,
            stop_id: stopId,
        });
    console.log('addFavoriteRemote', { deviceId, stopId });
    if (error) {
        console.warn('addFavoriteRemote failed:', error.message);
    }
}

export async function removeFavoriteRemote(stopId: number) {
    const deviceId = await getDeviceId();

    const { error } = await supabase
        .from('favorite_stops')
        .delete()
        .match({ device_id: deviceId, stop_id: stopId });

    if (error) {
        console.warn('removeFavoriteRemote failed:', error.message);
    }
}

/* ---------- SYNC ---------- */

// Local → Supabase
export async function syncFavoritesToSupabase() {
    const deviceId = await getDeviceId();
    const localIds = await getStopLocalFavorites();

    if (localIds.length === 0) return;

    const payload = localIds
        .map(id => Number(id))
        .filter(id => Number.isFinite(id))
        .map(id => ({
            device_id: deviceId,
            stop_id: id,
        }));

    await supabase
        .from('favorite_stops')
        .upsert(payload, { onConflict: 'device_id,stop_id' });
}

// Supabase → Local
export async function syncFavoritesFromSupabase() {
    const deviceId = await getDeviceId();

    const { data } = await supabase
        .from('favorite_stops')
        .select('stop_id')
        .eq('device_id', deviceId);

    if (!data) return;

    const ids = data.map(r => r.stop_id.toString());
    await setStopLocalFavorites(ids);
}
