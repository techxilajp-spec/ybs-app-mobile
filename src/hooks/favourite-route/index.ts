import api from "@/src/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Get favorite routes
 * @returns
 */
export const useGetFavoriteRoutes = () => {
  return useQuery({
    queryKey: ["favorite_routes"],
    queryFn: api.favouriteRouteApi.getFavoriteRoutes,
  });
};

/**
 * Add favorite route
 * @returns
 */
export const useAddFavoriteRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (routeId: number) => api.favouriteRouteApi.addFavorite(routeId),
    onSuccess: (_data, routeId) => {
      queryClient.setQueryData(["is_favourite_route", routeId], true);
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
    mutationFn: (routeId: number) =>
      api.favouriteRouteApi.removeFavorite(routeId),
    onSuccess: (_data, routeId) => {
      queryClient.setQueryData(["is_favourite_route", routeId], false);
      queryClient.invalidateQueries({ queryKey: ["favorite_routes"] });
    },
  });
};

/**
 * Check if a route is favorite
 * @returns
 */
export const useIsFavoriteRoute = (routeId: number) => {
  return useQuery({
    queryKey: ["is_favourite_route", routeId],
    queryFn: () => api.favouriteRouteApi.isFavorite(routeId),
  });
};

/**
 * Clear all favorite routes
 * @returns
 */
export const useCleanFavouriteRoutes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.favouriteRouteApi.clearFavorites(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite_routes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["is_favourite_route"],
      });
    },
  });
};
