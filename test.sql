DROP VIEW IF EXISTS public.view_stops_details_with_routes;
CREATE OR REPLACE VIEW public.view_stops_details_with_routes AS
SELECT
  s.id,
  s.lat,
  s.lng,
  s.name_mm AS "nameMm",
  s.name_en AS "nameEn",
  s.road_mm AS "roadMm",
  s.road_en AS "roadEn",
  t.township_mm AS "townshipMm",
  t.township_en AS "townshipEn",
  COALESCE(
    jsonb_agg(
      DISTINCT jsonb_build_object(
        'routeId', r.id,
        'routeNumberEn', r.number_en,
        'routeNumberMm', r.number_mm,
        'routeName', r.name,
        'isYps', r.is_yps,
        'coordinates', r.coordinates,
        'color', r.color,
        'busStopNamesEn', r.bus_stop_names_en,
        'busStopNamesMm', r.bus_stop_names_mm
      )
    ) FILTER (WHERE r.id IS NOT NULL),
    '[]'::jsonb
  ) AS routes
FROM public.stops s
LEFT JOIN public.township t
  ON t.id = s.township_id
LEFT JOIN public.route_detail rd
  ON rd.stop_id = s.id
LEFT JOIN (
  SELECT 
    r.*,
    COALESCE(rs.bus_stop_names_en, '') AS bus_stop_names_en,
    COALESCE(rs.bus_stop_names_mm, '') AS bus_stop_names_mm
  FROM routes r
  LEFT JOIN (
    SELECT 
      rd.route_id,
      STRING_AGG(st.name_en, ', ' ORDER BY rd.id) AS bus_stop_names_en,
      STRING_AGG(st.name_mm, ', ' ORDER BY rd.id) AS bus_stop_names_mm
    FROM route_detail rd
    LEFT JOIN stops st ON st.id = rd.stop_id
    WHERE rd.del_flg = 0
    GROUP BY rd.route_id
  ) rs ON rs.route_id = r.id
) r ON r.id = rd.route_id
GROUP BY
  s.id,
  s.lat,
  s.lng,
  s.name_mm,
  s.name_en,
  s.road_mm,
  s.road_en,
  t.township_mm,
  t.township_en;
