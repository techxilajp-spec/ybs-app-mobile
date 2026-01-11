import api from "@/src/api";
import { favouriteRouteRequest } from "@/src/types/favourite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Get favorite routes
 * @param activeTab
 * @returns
 */
export const useGetFavoriteRoutes = (activeTab: string) => {
  return useQuery({
    queryKey: ["favorite_routes", activeTab],
    queryFn: () => api.favouriteApi.getFavorites(),
    enabled: activeTab === "routes",
  });
};

/**
 * Add favorite route
 * @returns
 */
export const useAddFavoriteRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (route: favouriteRouteRequest) =>
      api.favouriteApi.addFavorite(route),
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
    mutationFn: (route: favouriteRouteRequest) =>
      api.favouriteApi.removeFavorite(route),
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
