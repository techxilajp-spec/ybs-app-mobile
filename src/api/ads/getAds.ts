import { supabase } from "@/src/utils/supabase";

interface AdListResponse {
  id: number;
  title: string;
  link: string;
  level: number;
  ads_images: { image_url: string }[];
}

const getAds = async (): Promise<AdListResponse[] | undefined> => {
  const today = new Date().toISOString().slice(0, 10); // "2026-01-10"

  const { data, error } = await supabase
    .from("ads")
    .select(
      `
        id,
        title,
        link,
        level,
        ads_images(
            image_url
        )
      `
    )
    .lte("start_date::date", today)
    .gte("end_date::date", today)
    .eq("del_flg", 0)
    .order("level", { ascending: true });

  if (error) {
    console.error("Error fetching ads:", error);
    return;
  }

  return data as AdListResponse[];
};

export default getAds;
