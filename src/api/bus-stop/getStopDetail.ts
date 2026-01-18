import { supabase } from "@/src/utils/supabase";

interface StopDetailResponse {
  id: string;
  nameMm: string;
  nameEn: string;
  lat: number;
  lng: number;
  townshipMm: string;
  townshipEn: string;
  roadEn: string;
  roadMm: string;
  routes: RouteResponse[];
}

interface RouteResponse {
  routeId: number;
  routeName: string;
  routeNumberEn: string;
  routeNumberMm: string;
  isYps: boolean;
  coordinates: Array<[number, number]>;
  color: string;
  busStopNamesMm: string;
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
 * Get stop detail
 * @param id
 * @returns
 */
const getStopDetail = async (
  id: string
): Promise<StopDetailResponse | null> => {
  const { data, error } = await supabase
    .from("view_stops_details_with_routes")
    .select(
      `
        id,
        nameMm,
        nameEn, 
        lat,
        lng,
        roadMm,
        roadEn,
        townshipEn,
        townshipMm,
        routes
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;
  const routes = safeParse<RouteResponse[]>(data.routes, []);
  return {
    ...data,
    routes,
  };
};

export default getStopDetail;
