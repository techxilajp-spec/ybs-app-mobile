import api from "@/src/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
      queryClient.setQueryData(["is_favourite_stop", stopId], true);
      queryClient.invalidateQueries({ queryKey: ["favorite_stops"] });
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
      queryClient.setQueryData(["is_favourite_stop", stopId], false);
      queryClient.invalidateQueries({ queryKey: ["favorite_stops"] });
    },
  });
};

/**
 * Check if a stop is favorite
 * @returns
 */
export const useIsFavoriteStop = (stopId: number) => {
  return useQuery({
    queryKey: ["is_favourite_stop", stopId],
    queryFn: () => api.favouriteStopsApi.isFavorite(stopId)
  })
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
      queryClient.invalidateQueries({ queryKey: ["is_favourite_stop"] });
    }
  });
};
