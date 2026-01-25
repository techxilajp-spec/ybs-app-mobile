import api from "@/src/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Fetch all favorite stop IDs.
 */
export const useGetFavoriteStopIds = () => {
  return useQuery({
    queryKey: ["favorite_stop_ids"],
    queryFn: api.favouriteStopsApi.getFavorites
  })
}

/**
 * Get favorite stops
 * @returns
 */
export const useGetFavoriteStops = () => {
  return useQuery({
    queryKey: ["favorite_stops"],
    queryFn: api.favouriteStopsApi.getFavoriteStops,
  });
};

/**
 * Add favorite stop
 * @returns
 */
export const useAddFavoriteStop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stopId: number) => api.favouriteStopsApi.addFavorite(stopId),
    onSuccess: (_data, stopId) => {
      queryClient.invalidateQueries({ queryKey: ["favorite_stops"] });
      queryClient.setQueryData<number[]>(
        ["favorite_stop_ids"],
        (old = []) => [...old, stopId]
      );
    },
  });
};

/**
 * Remove favorite stop
 * @returns
 */
export const useRemoveFavoriteStop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stopId: number) =>
      api.favouriteStopsApi.removeFavorite(stopId),
    onSuccess: (_data, stopId) => {
      queryClient.invalidateQueries({ queryKey: ["favorite_stops"] });
      queryClient.setQueryData<number[]>(
        ["favorite_stop_ids"],
        (old = []) => old.filter((id) => id !== stopId)
      );
    },
  });
};

/**
 * Clear all favorite stops
 * @returns
 */
export const useCleanFavouriteStops = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.favouriteStopsApi.clearFavorites(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite_stops"] });
      queryClient.setQueryData(["favorite_stop_ids"], []);
    }
  });
};
