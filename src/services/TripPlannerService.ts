import { RouteSearchResult } from "@/src/types/map";
import { supabase } from "@/src/utils/supabase";

interface Location {
    latitude: number;
    longitude: number;
}

export const TripPlannerService = {
    async planTrip(start: Location, end: Location): Promise<RouteSearchResult[]> {
        const { data, error } = await supabase.functions.invoke('plan-trip', {
            body: {
                startLocation: start,
                endLocation: end,
            },
        });

        if (error) {
            console.error("Trip Plan Error:", error);
            throw error;
        }

        // API returns {message, routes} structure
        if (data && typeof data === 'object' && 'routes' in data) {
            return data.routes as RouteSearchResult[];
        }

        return data as RouteSearchResult[];
    }
};
