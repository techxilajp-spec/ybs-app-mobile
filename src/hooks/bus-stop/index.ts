import api from '@/src/api'
import { useQuery } from '@tanstack/react-query'

/**
 * Hook for searching bus stops by name.
 * @param name Search string
 */
export const useSearchBusStops = (name: string) => {
    return useQuery({
        queryKey: ['bus-stops', name],
        queryFn: () => api.busStopApi.getBusStops(name),
        enabled: name.trim().length > 0, // Only fetch if there's a search term
        select: (data) => data.data ?? [],
    })
}
