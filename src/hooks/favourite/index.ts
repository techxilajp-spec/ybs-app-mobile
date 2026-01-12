import api from "@/src/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Get favorite routes
 * @returns
 */
export const useGetFavoriteRoutes = () => {
  return useMutation({
    mutationKey: ["favorite_routes"],
    mutationFn: () => api.favouriteApi.getFavoriteRoutes(),
  });
};

/**
 * Add favorite route
 * @returns
 */
export const useAddFavoriteRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routeId: number) => api.favouriteApi.addFavorite(routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite_routes"] });
    },
  });
};

/**
 * Remove favorite route
 * @returns
 */
export const useRemoveFavoriteRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routeId: number) => api.favouriteApi.removeFavorite(routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite_routes"] });
    },
  });
};

/**
 * Check if a route is favorite
 * @returns
 */
export const useIsFavoriteRoute = () => {
  return useMutation({
    mutationFn: (routeId: number) => api.favouriteApi.isFavorite(routeId),
  });
};

/**
 * Clear all favorite routes
 * @returns
 */
export const useCleanFavouriteRoutes = () => {
  return useMutation({
    mutationFn: () => api.favouriteApi.clearFavorites(),
  });
};
