import { Stop } from "@/src/types/bus";
import { supabase } from "@/src/utils/supabase";

interface PaginatedStopsResponse {
  data: Stop[];
  nextPage: number | null;
}
const getStops = async (
  page: number = 1,
  limit: number = 500,
  townshipId?: number,
  name?: string,
): Promise<PaginatedStopsResponse> => {
  let stops: any[] = [];
  if (page < 1) return { data: [], nextPage: null };

  const from = (page - 1) * limit;

  const to = from + limit - 1;
  const { data, error } = await supabase.rpc("search_stops", {
    p_name: name || null,
    p_township_id: townshipId || null,
    p_page: page,
    p_limit: limit,
  });

  if (error) {
    throw new Error(error.message);
  }

  stops.push(...(data || []));

  // Since we're fetching exactly limit rows (no +1), check if we got fewer rows
  // If we got fewer than limit, we're at the last page
  const nextPage = stops.length === limit ? page + 1 : null;
  return {
    data: stops,
    nextPage,
  };
};

export default getStops;
