import api from "@/src/api";
import { AreasGroupResponse, StopDetailResponse } from "@/src/types/bus";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

/**
 * Hook for searching bus stops by name.
 * @param name Search string
 */
export const useSearchBusStops = (name: string) => {
  return useQuery({
    queryKey: ["bus-stops", name],
    queryFn: () => api.busStopApi.getBusStops(name),
    enabled: name.trim().length > 0, // Only fetch if there's a search term
    select: (data) => data.data ?? [],
  });
};

/**
 * --- Get Bus Stops ---
 * @param townshipId - Optional township ID to filter stops
 * @returns
 */
export const useGetStops = (townshipId?: number) => {
  return useInfiniteQuery({
    queryKey: ["stops", townshipId],
    queryFn: ({ pageParam }) =>
      api.busStopsApi.getStops(pageParam, 500, townshipId),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
};

export const useGetAreas = () => {
  return useQuery<any, Error, AreasGroupResponse[]>({
    queryKey: ["area"],
    queryFn: () => api.busStopApi.getAreas(),
  });
};

// --- Get Bus Stop Detil ---
export const useGetStopDetail = (id: string) => {
  return useQuery<any, Error, StopDetailResponse>({
    queryKey: ["stop_detail", id],
    queryFn: () => api.busStopsApi.getStopDetail(id),
  });
};
