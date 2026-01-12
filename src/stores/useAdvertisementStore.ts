import { create } from "zustand";

type AdvertisementStore = {
    hasSeenAdvertisement: boolean;
    setHasSeenAdvertisement: (seen: boolean) => void;
};

export const useAdvertisementStore = create<AdvertisementStore>((set) => ({
    hasSeenAdvertisement: false,
    setHasSeenAdvertisement: (seen) => set({ hasSeenAdvertisement: seen }),
}));
