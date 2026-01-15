import api from "@/src/api";
import { AreasGroup, Stop, StopDetailResponse } from "@/src/types/bus";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

type StopsResponse = {
  stops: Stop[] | any[]; // Stop rows (may have name_mm/name_en from API)
  areas: AreasGroup[];
};

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
 * @returns
 */
export const useGetStops = () => {
  return useInfiniteQuery({
    queryKey: ["stops"],
    queryFn: ({ pageParam }) => api.busStopsApi.getStops(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
};

// --- Get Bus Stop Detil ---
export const useGetStopDetail = (id: string) => {
  return useQuery<any, Error, StopDetailResponse>({
    queryKey: ["stop_detail", id],
    queryFn: () => api.busStopsApi.getStopDetail(id),
  });
};
