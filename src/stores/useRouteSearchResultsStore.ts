import { create } from "zustand";

import { RouteSearchResult } from "../types/map";

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
