import api from "@/src/api";
import { Stop, StopDetailResponse } from "@/src/types/bus";
import { useQuery } from "@tanstack/react-query";

type AreasGroup = {
  id: string;
  title: string;
  options: { id: string; name: string }[];
};

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
        queryKey: ['bus-stops', name],
        queryFn: () => api.busStopApi.getBusStops(name),
        enabled: name.trim().length > 0, // Only fetch if there's a search term
        select: (data) => data.data ?? [],
    })
}

// --- Get Bus Stops ---
export const useGetStops = () => {
  return useQuery<any, Error, StopsResponse>({
    queryKey: ["stops"],
    queryFn: api.busStopsApi.getStops,
    // the API returns { data, areas }
    select: (res) => ({
      stops: res?.data ?? [],
      areas: res?.areas ?? [],
    }),
  });
};

// --- Get Bus Stop Detil ---
export const useGetStopDetail = (id: string) => {
  return useQuery<any, Error, StopDetailResponse>({
    queryKey: ["stop_detail", id],
    queryFn: () => api.busStopsApi.getStopDetail(id),
  });
};
