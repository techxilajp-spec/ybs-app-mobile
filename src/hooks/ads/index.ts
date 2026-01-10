import api from "@/src/api";
import { useQuery } from "@tanstack/react-query";

// --- Get Ads ---
export const useGetAds = () => {
    return useQuery({
        queryKey: ['ads'],
        queryFn: api.adsApi.getAds
    })
}