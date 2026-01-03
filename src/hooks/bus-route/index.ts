import api from '@/src/api'
import { useQuery } from '@tanstack/react-query'

// --- Get Routes ---
export const useGetRoutes = () => {
  return useQuery({
    queryKey: ['routes'],
    queryFn: api.busRouteApi.getRoutes,
    select: (data) => data ?? [],
  })
}
