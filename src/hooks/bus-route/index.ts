import api from '@/src/api'
import { useQuery } from '@tanstack/react-query'

// --- Get Routes ---
export const useGetRoutes = (
  is_yps : boolean = false,
  bus_number : string = ""
) => {
  return useQuery({
    queryKey: ['routes', is_yps, bus_number],
    queryFn: () => api.busRouteApi.getRoutes({ is_yps, bus_number})
  })
}

// --- Get Route Detail ---
export const useGetRouteDetail = (
  id: string
) => {
  return  useQuery({
    queryKey: ["route_detail", id],
    queryFn: () => api.busRouteApi.getRouteDetail(id)
  })
}
