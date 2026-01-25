import api from "@/src/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Fetch all favorite route IDs.
 */
export const useGetFavoriteRouteIds = () => {
  return useQuery({
    queryKey: ["favorite_route_ids"],
    queryFn: api.favouriteRouteApi.getFavoriteIds,
  });
};

/**
 * Fetch full favorite route objects.
 */
export const useGetFavoriteRoutes = () => {
  return useQuery({
    queryKey: ["favorite_routes"],
    queryFn: api.favouriteRouteApi.getFavoriteRoutes,
  });
};

/**
 * Add favorite route
 */
export const useAddFavoriteRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (routeId: number) => api.favouriteRouteApi.addFavorite(routeId),
    onSuccess: (_data, routeId) => {
      queryClient.invalidateQueries({ queryKey: ["favorite_routes"] });
      queryClient.setQueryData<number[]>(
        ["favorite_route_ids"],
        (old = []) => [...old, routeId]
      );
    },
  });
};

/**
 * Remove favorite route
 */
export const useRemoveFavoriteRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (routeId: number) =>
      api.favouriteRouteApi.removeFavorite(routeId),
    onSuccess: (_data, routeId) => {
      queryClient.invalidateQueries({ queryKey: ["favorite_routes"] });
      queryClient.setQueryData<number[]>(
        ["favorite_route_ids"],
        (old = []) => old.filter((id) => id !== routeId)
      );
    },
  });
};

/**
 * Clear all favorite routes
 */
export const useCleanFavouriteRoutes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.favouriteRouteApi.clearFavorites(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite_routes"],
      });
      queryClient.setQueryData(["favorite_route_ids"], []);
    },
  });
};
