export const FAVORITE_KEY = "favorite_routes";

export interface favouriteRouteRequest {
  routeId: number;
  routeName: string;
  routeNumberEn: string;
  routeNumberMm: string;
  color: string;
  isYps: boolean;
}

export const FAVORITE_STOP_KEY = "favorite_stops";

export interface FavouriteStopRequest {
  stopId: number;
  stopNameEn: string;
  stopNameMm: string;
  roadEn?: string;
  roadMm?: string;
  lat: number;
  lng: number;
}