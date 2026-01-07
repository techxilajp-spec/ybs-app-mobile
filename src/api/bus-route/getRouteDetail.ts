import { supabase } from "@/src/utils/supabase";

interface StopResponse {
  stopId: string;
  name_mm: string;
  name_en: string;
  road_mm: string;
  road_en: string;
  lat: number;
  lng: number;
}

interface RouteDetailResponse {
  routeId: number;
  routeName: string;
  routeNumberEn: string;
  routeNumberMm: string;
  coordinates: Array<[number, number]>;
  color: string;
  stops: StopResponse[];
}

/**
 * Safely parse JSON strings
 */
function safeParse<T>(value: string | T | undefined, fallback: T): T {
  if (!value) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

/**
 * Fetches route detail data by route id
 * @param id string
 * @returns route detail object or null
 */
const getRouteDetail = async (
  id: string
): Promise<RouteDetailResponse | null> => {
  const { data, error } = await supabase
    .from("route_detail_view")
    .select(
      `
      routeId,
      routeName,
      routeNumberEn,
      routeNumberMm,
      coordinates,
      color,
      stops
    `
    )
    .eq("routeId", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  const coordinates = safeParse<Array<[number, number]>>(data.coordinates, []);
  const stops = safeParse<StopResponse[]>(data.stops, []);

  return {
    ...data,
    coordinates,
    stops,
  };
};

export default getRouteDetail;
