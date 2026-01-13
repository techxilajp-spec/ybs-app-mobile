import { supabase } from "@/src/utils/supabase";

interface Route {
  routeId: number;
  routeName: string;
  routeNumberEn: string;
  routeColor: string;
  isYps: boolean;
  busStopNamesMm: string;
}

interface PaginatedRoutesResponse {
  data: Route[];
  nextPage: number | null;
}

type GetRouteFilter = {
  is_yps: boolean;
  bus_number: string;
};

const getRoutes = async (
  filter: GetRouteFilter,
  page: number = 1,
  limit: number = 50
): Promise<PaginatedRoutesResponse> => {
  const { is_yps, bus_number } = filter;

  if(page < 1) return { data: [], nextPage: null};

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const { data, error } = await supabase
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
    .eq("isYps", is_yps)
    .order("routeNumberEn", { ascending: true})
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const routes = data ?? [];
  const nextPage = routes.length === limit ? page + 1 : null;

  return {
    data: routes,
    nextPage
  }
};

export default getRoutes;
