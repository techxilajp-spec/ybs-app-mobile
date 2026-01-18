import api from "@/src/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetRecentStops = () => {
  return useQuery({
    queryKey: ["recent_stops"],
    queryFn: () => api.recent.getRecentStops(),
  });
};

export const useAddRecentStop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stopId: number) => api.recent.addRecent(stopId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recent_stops"] });
    },
  });
};

export const useRemoveRecentStop = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: (stopId: number) => api.recent.removeLastRecent(stopId),
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["recent_stops"] });
    },
  });
};

export const useIsRecentStop = () => {
  return useMutation({
    mutationFn: (stopId: number) => api.recent.isRecent(stopId),
  });
};
