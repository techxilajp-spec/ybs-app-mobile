import api from "@/src/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Get favorite stops
 * @returns
 */
export const useGetFavoriteStops = () => {
  return useMutation({
    mutationKey: ["favorite_stops"],
    mutationFn: () => api.favouriteStopsApi.getFavoriteStops(),
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
    onSuccess: () => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite_stops"] });
    },
  });
};

/**
 * Check if a stop is favorite
 * @returns
 */
export const useIsFavoriteStop = () => {
  return useMutation({
    mutationFn: (stopId: number) => api.favouriteStopsApi.isFavorite(stopId),
  });
};

/**
 * Clear all favorite stops
 * @returns
 */
export const useCleanFavouriteStops = () => {
  return useMutation({
    mutationFn: () => api.favouriteStopsApi.clearFavorites(),
  });
};
