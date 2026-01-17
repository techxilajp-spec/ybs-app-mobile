import api from "@/src/api";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

// --- Get Paginated Routes ---
export const useGetRoutes = (
  is_yps: boolean = false,
  bus_number: string = ""
) => {
  return useInfiniteQuery({
    queryKey: ["routes", is_yps, bus_number],
    queryFn: ({ pageParam }) =>
      api.busRouteApi.getRoutes({ is_yps, bus_number }, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage, // to indicate for next page
    initialPageParam: 1,
  });
};

// --- Get Route Detail ---
export const useGetRouteDetail = (id: string) => {
  return useQuery({
    queryKey: ["route_detail", id],
    queryFn: () => api.busRouteApi.getRouteDetail(id),
  });
};

// --- Increase Route View ---
export const useIncreaseRouteView = () => {
  return useMutation({
    mutationFn: (routeId : number) => api.busRouteApi.increaseRouteView(routeId)
  })
};
