import { create } from "zustand";
import { Stop } from "../types/bus";

type TripPlannerStore = {
    startLocation: Stop | null;
    endLocation: Stop | null;
    setStartLocation: (location: Stop | null) => void;
    setEndLocation: (location: Stop | null) => void;
    reset: () => void;
};

export const useTripPlannerStore = create<TripPlannerStore>((set) => ({
    startLocation: null,
    endLocation: null,
    setStartLocation: (location) => set({ startLocation: location }),
    setEndLocation: (location) => set({ endLocation: location }),
    reset: () => set({ startLocation: null, endLocation: null }),
}));
