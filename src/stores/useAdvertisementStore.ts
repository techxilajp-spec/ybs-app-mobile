import { create } from "zustand";

type Advertisement = {
    img_url: string;
    duration: number;
}

type AdvertisementStore = {
    advertisement: Advertisement | null;
    hasSeenAdvertisement: boolean;
    setAdvertisement: (ad : Advertisement) => void;
    setHasSeenAdvertisement: (seen: boolean) => void;
};

export const useAdvertisementStore = create<AdvertisementStore>((set) => ({
    advertisement: null,
    hasSeenAdvertisement: false,
    setAdvertisement: (ad) => set({ advertisement: ad }),
    setHasSeenAdvertisement: (seen) => set({ hasSeenAdvertisement: seen }),
}));
