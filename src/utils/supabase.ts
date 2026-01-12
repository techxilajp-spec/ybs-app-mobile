import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  }
);

export const getPublicUrl = (path: string): string => {
  const { data: urlData } = supabase.storage
    .from("ads-images")
    .getPublicUrl(path);
  return urlData?.publicUrl ?? "";
};
