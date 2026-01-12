import { supabase } from "@/src/utils/supabase";

/**
 * Fetches bus stops based on search criteria.
 * @param name Optional search string to filter by title_mm or title_en
 */
const getBusStops = async (name?: string) => {
    let query = supabase.from("stops").select(`
    id,
    name_mm,
    name_en,
    road_mm,
    road_en,
    lat,
    lng
  `);

    if (name) {
        query = query.or(`name_mm.ilike.%${name}%,name_en.ilike.%${name}%`);
    }

    // Limit results for performance
    query = query.limit(20);

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching bus stops:", error);
        throw new Error(error.message);
    }

    const mappedData = data?.map((stop: any) => ({
        ...stop,
        coordinate: {
            latitude: stop.lat,
            longitude: stop.lng,
        },
    }));

    return {
        data: mappedData || [],
    };
};

export default getBusStops;
