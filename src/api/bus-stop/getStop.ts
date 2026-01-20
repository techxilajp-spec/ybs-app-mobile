import { Stop } from "@/src/types/bus";
import { supabase } from "@/src/utils/supabase";

interface PaginatedStopsResponse {
  data: Stop[];
  nextPage: number | null;
}
const getStops = async (
  page: number = 1,
  limit: number = 500,
  townshipIds: number[] = [],
  name?: string,
): Promise<PaginatedStopsResponse> => {
  if (page < 1) return { data: [], nextPage: null };
  const { data, error } = await supabase.rpc("search_stops", {
    p_name: name || null,
    p_township_ids: townshipIds,
    p_page: page,
    p_limit: limit,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Since we're fetching exactly limit rows (no +1), check if we got fewer rows
  // If we got fewer than limit, we're at the last page
  const nextPage = data.length === limit ? page + 1 : null;
  return {
    data: data,
    nextPage,
  };
};

export default getStops;
