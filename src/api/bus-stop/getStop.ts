import { supabase } from "@/src/utils/supabase";

const getStops = async () => {
  const pageSize = 1000;
  let from = 0;
  let allRows: any[] = [];

  while (true) {
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("v_stops_with_bus_numbers")
      .select(`
        id,
        name_mm,
        name_en,
        road_mm,
        road_en,
        lat,
        lng,
        bus_numbers,
        township:township_id (
          id,
          township_mm,
          township_en,
          district:district_id (
            id,
            name
          )
        )
      `)
      .order("id", { ascending: true })
      .range(from, to);

    if (error) throw error;

    allRows.push(...(data || []));

    if (!data || data.length < pageSize) break;
    from += pageSize;
  }

  // --- build area grouping ---
  const areasMap: Record<
    string,
    { id: string; title: string; options: { id: string; name: string }[] }
  > = {};

  allRows.forEach((s: any) => {
    const township = s?.township;
    const district = township?.district;
    if (!township || !district) return;

    const districtId = String(district.id);
    if (!areasMap[districtId]) {
      areasMap[districtId] = {
        id: districtId,
        title: district.name,
        options: [],
      };
    }

    const townshipId = String(township.id);
    const townshipName =
      township.township_mm || township.township_en || "";

    if (
      !areasMap[districtId].options.some(
        (opt) => String(opt.id) === townshipId
      )
    ) {
      areasMap[districtId].options.push({
        id: townshipId,
        name: townshipName,
      });
    }
  });

  const areas = Object.values(areasMap);

  areas.forEach((a) =>
    a.options.sort((x, y) => x.name.localeCompare(y.name))
  );
  areas.sort((a, b) => a.title.localeCompare(b.title));

  return {
    data: allRows,
    areas,
  };
};

export default getStops;
