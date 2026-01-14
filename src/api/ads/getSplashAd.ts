import { supabase } from "@/src/utils/supabase";

interface SplashAdResponse {
  img_url: string;
  duration: number;
}

const getSplahAd = async () : Promise<SplashAdResponse | null> => {
  const { data, error } = await supabase
    .from("splash")
    .select(
      `
        img_url,
        duration
      `
    )
    .eq("active", true)
    .order("id", { ascending: true })
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? null;
};

export default getSplahAd;
