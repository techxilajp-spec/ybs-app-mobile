import { LatLng } from "react-native-maps";
import { create } from "zustand";

type Stop = {
  id: string;
  name: string;
  road: string;
  coordinate: LatLng;
};

type Route = {
  no: string;
  name: string;
  color: string;
  coordinates: LatLng[];
  stops: Stop[];
};

type RouteSearchResult = {
  id: number;
  isFastest: boolean;
  totalBusStop: number;
  estimatedTime: number;
  routes: Route[];
  instructions: string[];
};

type RouteSearchResultsStore = {
  routes: RouteSearchResult[];
  setRoutes: (data: RouteSearchResult[]) => void;
  clearRoutes: () => void;
};

export const useRouteSearchResultsStore =
  create<RouteSearchResultsStore>((set) => ({
    routes: [],
    setRoutes: (data) => set({ routes: data }),
    clearRoutes: () => set({ routes: [] }),
  }));
