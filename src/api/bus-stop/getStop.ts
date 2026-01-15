import { AreasGroup, Stop } from "@/src/types/bus";
import { supabase } from "@/src/utils/supabase";

interface PaginatedStopsResponse {
  data: Stop[];
  area: AreasGroup[];
  nextPage: number | null;
}
const getStops = async (
  page: number = 1,
  limit: number = 50
): Promise<PaginatedStopsResponse> => {
  let stops: any[] = [];
  if (page < 1) return { data: [], area: [], nextPage: null };

  const from = (page - 1) * limit;

  const to = from + limit - 1;
  const { data, error } = await supabase
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
      bus_numbers,
      township:township_id (
        id,
        township_mm,
        township_en,
        district:district_id (
          id,
          name
        )
      )
    `
    )
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  stops.push(...(data || []));

  // --- build area grouping ---
  const areasMap: Record<
    string,
    { id: string; title: string; options: { id: string; name: string }[] }
  > = {};

  stops.forEach((s: any) => {
    const township = s?.township;
    const district = township?.district;
    if (!township || !district) return;

    const districtId = String(district.id);
    if (!areasMap[districtId]) {
      areasMap[districtId] = {
        id: districtId,
        title: district.name,
        options: [],
      };
    }

    const townshipId = String(township.id);
    const townshipName = township.township_mm || township.township_en || "";

    if (
      !areasMap[districtId].options.some((opt) => String(opt.id) === townshipId)
    ) {
      areasMap[districtId].options.push({
        id: townshipId,
        name: townshipName,
      });
    }
  });

  const areas = Object.values(areasMap);

  areas.forEach((a) => a.options.sort((x, y) => x.name.localeCompare(y.name)));
  areas.sort((a, b) => a.title.localeCompare(b.title));

  // Since we're fetching exactly limit rows (no +1), check if we got fewer rows
  // If we got fewer than limit, we're at the last page
  const nextPage = stops.length === limit ? page + 1 : null;
  return {
    data: stops,
    area: areas,
    nextPage,
  };
};

export default getStops;
