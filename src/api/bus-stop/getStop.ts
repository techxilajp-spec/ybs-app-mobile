import { Stop } from "@/src/types/bus";
import { supabase } from "@/src/utils/supabase";

interface PaginatedStopsResponse {
  data: Stop[];
  nextPage: number | null;
}
const getStops = async (
  page: number = 1,
  limit: number = 50,
  townshipId?: number
): Promise<PaginatedStopsResponse> => {
  let stops: any[] = [];
  if (page < 1) return { data: [], nextPage: null };

  const from = (page - 1) * limit;

  const to = from + limit - 1;
  let query = supabase
    .from("v_stops_with_bus_numbers")
    .select(
      `
      id,
      name_mm,
      name_en,
      road_mm,
      road_en,
      lat,
      lng,
      township_id,
      bus_numbers
    `
    )
    .order("id", { ascending: true })
    .range(from, to);

  if (townshipId != null) {
    query = query.eq("township_id", townshipId);
  }

  const { data, error } = await query;

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
