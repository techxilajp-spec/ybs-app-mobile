export const FAVORITE_KEY = "favorite_routes";

export interface favouriteRouteRequest {
  routeId: number;
  routeName: string;
  routeNumberEn: string;
  routeNumberMm: string;
  color: string;
  isYps: boolean;
}
