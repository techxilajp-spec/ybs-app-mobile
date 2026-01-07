import { supabase } from "@/src/utils/supabase";

interface RouteListResponse {
  routeId: number;
  routeName: string;
  routeNumberEn: string;
  routeColor: string;
  isYps: boolean;
  busStopNamesMm: string;
}

type GetRouteFilter = {
  is_yps: boolean;
  bus_number: string;
};

const getRoutes = async (
  filter: GetRouteFilter
): Promise<RouteListResponse[]> => {
  const { is_yps, bus_number } = filter;

  let { data, error } = await supabase
    .from("route_list_view")
    .select(
      `
      routeId,
      routeName,
      routeNumberEn,
      routeColor,
      isYps,
      busStopNamesMm
    `
    )
    .or(`routeNumberEn.ilike.%${bus_number}%,routeNumberMm.ilike.%${bus_number}%`)
    .eq("isYps", is_yps);

  if (error) {
    console.error("Error fetching routes:", error);
    throw new Error(error.message);
  }

  return data ?? [];
};

export default getRoutes;
