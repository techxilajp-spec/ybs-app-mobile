import { supabase } from "@/src/utils/supabase";

const increaseRouteView = async (routeId: number) => {
    let { data, error } = await supabase
    .rpc('increment_route_view', {
        p_route_id: routeId
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export default increaseRouteView;