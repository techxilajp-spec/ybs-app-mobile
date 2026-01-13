import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Location {
    latitude: number;
    longitude: number;
}

interface Stop {
    id: number;
    lat: number;
    lng: number;
    name_mm: string;
    road_mm: string;
    township_id: number;
}

interface Route {
    id: number;
    number_mm: string;
    name: string;
    color: string;
    coordinates: string; // JSON string in DB
}

interface RouteDetail {
    route_id: number;
    stop_id: number;
    stop_sequence: number;
}

interface Segment {
    routeId: number;
    startStopId: number;
    endStopId: number;
    stopCount: number;
}

interface Solution {
    type: string;
    totalTransfers: number;
    segments: Segment[];
    startUnwalk: number;
    endWalk: number;
}

// Helper: Find closest point index
const findClosestPointIndex = (path: { lat: number; lng: number }[], target: { lat: number; lng: number }) => {
    let minDist = Infinity;
    let closestIndex = -1;

    for (let i = 0; i < path.length; i++) {
        const dist = Math.pow(path[i].lat - target.lat, 2) + Math.pow(path[i].lng - target.lng, 2);
        if (dist < minDist) {
            minDist = dist;
            closestIndex = i;
        }
    }
    return closestIndex;
};

async function findNearestStops(
    supabase: any,
    lat: number,
    lng: number
): Promise<Stop[]> {
    const radiuses = [1000, 5000]; // meters

    for (const radius of radiuses) {
        const { data, error } = await supabase.rpc("search_nearest_stop", {
            p_lat: lat,
            p_lng: lng,
            p_radius_meters: radius,
        });

        if (error) throw error;

        if (data && data.length > 0) {
            return data as Stop[];
        }
    }

    return [];
}

serve(async (req) => {
    // Handle CORS
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { startBusStopId, endBusStopId } = await req.json();

        if (!startBusStopId || !endBusStopId) {
            throw new Error("Start and End Bus Stop IDs are required");
        }

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Fetch Start and End Stops directly by ID
        const { data: inputStops, error: stopsError } = await supabase
            .from('stops')
            .select('id, lat, lng, name_mm, road_mm, township_id')
            .in('id', [startBusStopId, endBusStopId]);

        if (stopsError) throw stopsError;

        if (!inputStops || inputStops.length < 2) { // minimal check, might need robust check if start==end
            return new Response(JSON.stringify({
                message: "Bus stops not found.",
                routes: []
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Identify which is start and end (in case IDs are same or order differs)
        let startStops: Stop[] = [];
        let endStops: Stop[] = [];

        inputStops.forEach((s: any) => {
            // loose comparison for string/number ID mismatch safety
            if (s.id == startBusStopId) startStops.push(s);
            if (s.id == endBusStopId) endStops.push(s);
        });

        // Fetch Location for distance calculations (using the stop's location)
        // If startStops has multiple (unlikely with ID), take first.
        const startLocation = { latitude: startStops[0].lat, longitude: startStops[0].lng };
        const endLocation = { latitude: endStops[0].lat, longitude: endStops[0].lng };

        if (startStops.length === 0 || endStops.length === 0) {
            return new Response(JSON.stringify({
                message: "Bus stops not found.",
                routes: []
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 2. Fetch relevant routes (passing through start OR end stops)
        const startStopIds = startStops.map(s => s.id);
        const endStopIds = endStops.map(s => s.id);
        const allRelevantStopIds = [...new Set([...startStopIds, ...endStopIds])];

        const { data: servedRoutes, error: servedRoutesError } = await supabase
            .from('route_detail')
            .select('route_id')
            .neq('del_flg', 1)
            .in('stop_id', allRelevantStopIds);

        if (servedRoutesError) throw servedRoutesError;

        const relevantRouteIds = [...new Set((servedRoutes as any[]).map(r => r.route_id))];

        if (relevantRouteIds.length === 0) {
            return new Response(JSON.stringify({
                message: "ဤမှတ်တိုင်များကို သွားရောက်သော လမ်းကြောင်းများ မတွေ့ပါ။",
                routes: []
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 3. Fetch full Route Details for these potential routes
        const { data: routeDetailsData, error: rdError } = await supabase
            .from('route_detail')
            .select('route_id, stop_id, stop_sequence')
            .neq('del_flg', 1)
            .in('route_id', relevantRouteIds)
            .order('stop_sequence');

        if (rdError) throw rdError;
        const routeDetails = routeDetailsData as unknown as RouteDetail[];

        // 4. Fetch Route Info (Name, etc) WITH COORDINATES
        const { data: routesData, error: rError } = await supabase
            .from('routes')
            .select('id, number_mm, name, color, coordinates')
            .neq('del_flg', 1)
            .in('id', relevantRouteIds);

        if (rError) throw rError;
        const routes = routesData as unknown as Route[];

        // 5. Fetch ALL stops implicated in these routes (for path reconstruction)
        const implicatedStopIds = [...new Set(routeDetails.map(rd => rd.stop_id))];

        const { data: stopsData, error: sError } = await supabase
            .from('stops')
            .select('id, lat, lng, name_mm, road_mm, township_id')
            .neq('del_flg', 1)
            .in('id', implicatedStopIds);

        if (sError) throw sError;
        const stops = stopsData as unknown as Stop[];

        // Build Graph
        const stopsMap = new Map(stops.map(s => [s.id, s]));
        const routesMap = new Map(routes.map(r => [r.id, r]));

        // Stop -> Routes mapping
        const stopToRoutes = new Map<number, number[]>();
        // Route -> Ordered Stops mapping
        const routeToStops = new Map<number, { stop_id: number, seq: number }[]>();

        routeDetails.forEach((rd: RouteDetail) => {
            // Connect stop to route
            if (!stopToRoutes.has(rd.stop_id)) stopToRoutes.set(rd.stop_id, []);
            stopToRoutes.get(rd.stop_id)?.push(rd.route_id);

            if (!routeToStops.has(rd.route_id)) routeToStops.set(rd.route_id, []);
            routeToStops.get(rd.route_id)?.push({ stop_id: rd.stop_id, seq: rd.stop_sequence });
        });

        // Configurable Walking Limit
        const WALKING_LIMIT_METERS = 500;

        // Helper: Haversine Distance (in Meters checking)
        const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
            const R = 6371; // km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        // Deduplication Map: Key -> Solution
        const solutionsMap = new Map<string, Solution>();

        // Helper to calculate score (Lower is better)
        const calculateScore = (sol: Solution) => {
            const busTime = sol.segments.reduce((acc, seg) => acc + seg.stopCount, 0) * 3;
            const walkTime = (sol.startUnwalk + sol.endWalk) * 12; // 12 mins per km
            return busTime + walkTime;
        };

        const addSolution = (key: string, sol: Solution) => {
            const newScore = calculateScore(sol);
            if (!solutionsMap.has(key)) {
                solutionsMap.set(key, sol);
            } else {
                const existingSol = solutionsMap.get(key)!;
                const existingScore = calculateScore(existingSol);
                if (newScore < existingScore) {
                    solutionsMap.set(key, sol);
                }
            }
        };

        // --- 1. Direct Routes ---
        for (const sStop of startStops) {
            const sRoutes = stopToRoutes.get(sStop.id) || [];
            for (const rId of sRoutes) {
                const routeInfo = routeToStops.get(rId);
                if (!routeInfo) continue;

                // Find index of sStop
                const sIndex = routeInfo.findIndex(x => x.stop_id === sStop.id);
                if (sIndex === -1) continue;

                // Check if any end stop is after sIndex
                for (const eStop of endStops) {
                    const eIndex = routeInfo.findIndex(x => x.stop_id === eStop.id);
                    if (eIndex > sIndex) {
                        // Found Direct Route!
                        const sol: Solution = {
                            type: "direct",
                            totalTransfers: 0,
                            segments: [{
                                routeId: rId,
                                startStopId: sStop.id,
                                endStopId: eStop.id,
                                stopCount: eIndex - sIndex
                            }],
                            startUnwalk: getDistance(startLocation.latitude, startLocation.longitude, sStop.lat, sStop.lng),
                            endWalk: getDistance(eStop.lat, eStop.lng, endLocation.latitude, endLocation.longitude)
                        };
                        const route = routesMap.get(rId);
                        const key = route ? `direct-${route.number_mm}-${route.name}` : `direct-${rId}`;
                        addSolution(key, sol);
                    }
                }
            }
        }

        // --- 2. One Transfer (S -> R1 -> TransferStop -> Walk -> TransferStop -> R2 -> E) ---

        // Find Set of Start Routes
        const startRoutesMap = new Map<number, number>(); // RouteID -> StartStopID (closest/first)
        for (const s of startStops) {
            const rs = stopToRoutes.get(s.id) || [];
            for (const r of rs) {
                if (!startRoutesMap.has(r)) startRoutesMap.set(r, s.id);
            }
        }

        // Find Set of End Routes
        const endRoutesMap = new Map<number, number>(); // RouteID -> EndStopID
        for (const s of endStops) {
            const rs = stopToRoutes.get(s.id) || [];
            for (const r of rs) {
                if (!endRoutesMap.has(r)) endRoutesMap.set(r, s.id);
            }
        }

        // Intersection logic with WALKING
        for (const [r1, startStopId] of startRoutesMap.entries()) {
            const route1Stops = routeToStops.get(r1) || [];
            const startIdx = route1Stops.findIndex(x => x.stop_id === startStopId);
            if (startIdx === -1) continue;

            const r1StopsToCheck = route1Stops.slice(startIdx + 1);

            for (const [r2, endStopId] of endRoutesMap.entries()) {
                if (r1 === r2) continue; // Already covered by direct

                const route2Stops = routeToStops.get(r2) || [];
                const endIdx = route2Stops.findIndex(x => x.stop_id === endStopId);
                if (endIdx === -1) continue;

                // We need to transfer to a stop on R2 appearing BEFORE the endStop
                const r2StopsToCheck = route2Stops.slice(0, endIdx);

                // Optimization: Iterate R1 stops and R2 stops and find close pair
                for (const s1 of r1StopsToCheck) {
                    const stop1 = stopsMap.get(s1.stop_id);
                    if (!stop1) continue;

                    for (const s2 of r2StopsToCheck) {
                        const stop2 = stopsMap.get(s2.stop_id);
                        if (!stop2) continue;

                        const distKm = getDistance(stop1.lat, stop1.lng, stop2.lat, stop2.lng);
                        if (distKm * 1000 <= WALKING_LIMIT_METERS) {
                            // Found Valid Transfer!
                            const s1Idx = route1Stops.findIndex(x => x.stop_id === s1.stop_id);
                            const s2Idx = route2Stops.findIndex(x => x.stop_id === s2.stop_id);

                            const sol: Solution = {
                                type: "1-transfer",
                                totalTransfers: 1,
                                segments: [
                                    {
                                        routeId: r1,
                                        startStopId: startStopId,
                                        endStopId: s1.stop_id,
                                        stopCount: s1Idx - startIdx
                                    },
                                    {
                                        routeId: r2,
                                        startStopId: s2.stop_id,
                                        endStopId: endStopId,
                                        stopCount: endIdx - s2Idx
                                    }
                                ],
                                startUnwalk: getDistance(startLocation.latitude, startLocation.longitude, stopsMap.get(startStopId)!.lat, stopsMap.get(startStopId)!.lng),
                                endWalk: getDistance(stopsMap.get(endStopId)!.lat, stopsMap.get(endStopId)!.lng, endLocation.latitude, endLocation.longitude)
                            };
                            const route1 = routesMap.get(r1);
                            const route2 = routesMap.get(r2);
                            const key = (route1 && route2)
                                ? `transfer-${route1.number_mm}-${route1.name}-${route2.number_mm}-${route2.name}`
                                : `transfer-${r1}-${r2}`;

                            addSolution(key, sol);
                        }
                    }
                }
            }
        }

        // --- 3. Construct Response ---
        // Format solutions for Frontend

        const solutions = Array.from(solutionsMap.values());

        const detailedSolutions = solutions.map((sol: Solution) => {
            let totalBusStops = 0;
            const routesInfo = sol.segments.map((seg: Segment) => {
                totalBusStops += seg.stopCount;
                const r = routesMap.get(seg.routeId);
                const s1 = stopsMap.get(seg.startStopId);
                const s2 = stopsMap.get(seg.endStopId);

                if (!r || !s1 || !s2) return undefined;

                // Helper to normalize coordinate (swap if flipped)
                const normalizeCoord = (lat: number, lng: number) => {
                    if (Math.abs(lat) > 90) return { lat: lng, lng: lat };
                    return { lat, lng };
                };

                // Parse Route Coordinates
                let fullPath: { lat: number, lng: number }[] = [];
                try {
                    const rawCoords = typeof r.coordinates === 'string' ? JSON.parse(r.coordinates) : r.coordinates;
                    if (Array.isArray(rawCoords)) {
                        fullPath = rawCoords.map((c: any) => {
                            let lat, lng;
                            if (Array.isArray(c)) {
                                lat = c[0]; lng = c[1];
                            } else {
                                lat = c.lat || c.latitude; lng = c.lng || c.longitude;
                            }
                            return normalizeCoord(lat, lng);
                        });
                    }
                } catch (e) {
                    console.error("Error parsing coordinates", e);
                }

                // Slice path
                let slicedPath: { lat: number, lng: number }[] = [];
                if (fullPath.length > 0) {
                    const startIdx = findClosestPointIndex(fullPath, { lat: s1.lat, lng: s1.lng });
                    const endIdx = findClosestPointIndex(fullPath, { lat: s2.lat, lng: s2.lng });

                    if (startIdx !== -1 && endIdx !== -1) {
                        // Ensure direction (simplified)
                        if (startIdx <= endIdx) {
                            slicedPath = fullPath.slice(startIdx, endIdx + 1);
                        } else {
                            slicedPath = fullPath.slice(endIdx, startIdx + 1).reverse();
                        }
                    }
                }

                if (slicedPath.length === 0) {
                    slicedPath = [{ lat: s1.lat, lng: s1.lng }, { lat: s2.lat, lng: s2.lng }];
                } else {
                    // Ensure visual connectivity
                    slicedPath.unshift({ lat: s1.lat, lng: s1.lng });
                    slicedPath.push({ lat: s2.lat, lng: s2.lng });
                }

                let color = r.color;
                if (color && !color.startsWith('#')) color = `#${color}`;

                const rStopsFull = routeToStops.get(seg.routeId) || [];
                const idx1 = rStopsFull.findIndex(x => x.stop_id === seg.startStopId);
                const idx2 = rStopsFull.findIndex(x => x.stop_id === seg.endStopId);
                const segmentStops = rStopsFull.slice(idx1, idx2 + 1)
                    .map(x => stopsMap.get(x.stop_id))
                    .filter((s): s is Stop => s !== undefined);

                return {
                    ...r,
                    color: color,
                    startStop: s1.name_mm,
                    endStop: s2.name_mm,
                    startStopId: s1.id, // Keep ID for transfer check
                    endStopId: s2.id,   // Keep ID for transfer check
                    coordPath: slicedPath.map(p => ({ latitude: p.lat, longitude: p.lng })),
                    stops: segmentStops
                };
            }).filter((r): r is any => r !== undefined);

            if (routesInfo.length === 0) return undefined;

            // Map to Frontend types
            const mappedRoutes = routesInfo.map((r: any) => ({
                id: r.id.toString(),
                no: r.number_mm,
                name: r.name,
                description: `${r.startStop} - ${r.endStop}`,
                color: r.color,
                coordinates: r.coordPath,
                stops: r.stops.map((s: Stop) => ({
                    id: s.id.toString(),
                    name: s.name_mm,
                    road: s.road_mm,
                    coordinate: { latitude: s.lat, longitude: s.lng }
                }))
            }));

            // Score with Transfer Walk
            let totalTransferWalkDist = 0;
            for (let i = 0; i < sol.segments.length - 1; i++) {
                const s1 = stopsMap.get(sol.segments[i].endStopId);
                const s2 = stopsMap.get(sol.segments[i + 1].startStopId);
                if (s1 && s2 && s1.id !== s2.id) {
                    totalTransferWalkDist += getDistance(s1.lat, s1.lng, s2.lat, s2.lng);
                }
            }

            const busTime = totalBusStops * 3;
            // 12 mins per km walking
            const walkTime = (sol.startUnwalk + sol.endWalk + totalTransferWalkDist) * 12;
            const totalTime = Math.ceil(busTime + walkTime);

            const instructions: {
                type: string;
                description?: string;
                busNo?: string;
                busTitle?: string;
                startStop?: string;
                endStop?: string;
            }[] = [];

            // 1. Walk to first stop (Removed for ID Search)

            // 2. Bus Segments
            routesInfo.forEach((r: any, idx: number) => {
                if (idx > 0) {
                    // Check if transfer involves walking
                    const prevEndStopId = routesInfo[idx - 1].endStopId;
                    const currStartStopId = r.startStopId;

                    if (prevEndStopId !== currStartStopId) {
                        const s1 = stopsMap.get(prevEndStopId);
                        const s2 = stopsMap.get(currStartStopId);
                        if (s1 && s2) {
                            const distMeters = Math.round(getDistance(s1.lat, s1.lng, s2.lat, s2.lng) * 1000);
                            instructions.push({
                                type: "walk",
                                description: `${s1.name_mm} မှ ${s2.name_mm} သို့လမ်းလျှောက်ပါ (${distMeters}m)`
                            });
                        } else {
                            // Fallback
                            instructions.push({
                                type: "walk",
                                description: `နောက်မှတ်တိုင်သို့ လမ်းလျှောက်ပြောင်းစီးပါ`
                            });
                        }
                    } else {
                        // Same stop transfer
                        instructions.push({
                            type: "walk",
                            description: `${r.startStop} မှတ်တိုင်တွင်ပြောင်းစီးပါ`
                        });
                    }
                }
                instructions.push({
                    type: "bus",
                    busNo: r.number_mm,
                    busTitle: r.name,
                    startStop: r.startStop,
                    endStop: r.endStop
                });
            });

            // 3. Walk to dest (Removed for ID Search)

            return {
                id: Math.random(),
                isFastest: false,
                totalBusStop: totalBusStops,
                estimatedTime: totalTime,
                routes: mappedRoutes,
                instructions
            };
        })
            .filter((sol): sol is any => sol !== undefined)
            .sort((a, b) => a.estimatedTime - b.estimatedTime)
            .slice(0, 5); // Return top 5

        if (detailedSolutions.length > 0) detailedSolutions[0].isFastest = true;

        return new Response(JSON.stringify(detailedSolutions), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
