import { supabase } from "@/src/utils/supabase";

const getStops = async () => {
  const pageSize = 1000;
  let from = 0;
  let allRows: any[] = [];
  // fetch stops with related township and district data

  while (true) {
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from("stops")
      .select(
        `
      id,
      name_mm,
      name_en,
      road_mm,
      road_en,
      lat,
      lng,
      township:township_id (
        id,
        township_mm,
        township_en,
        district:district_id (
          id,
          name
        )
      )
    `
      )
      .order("id", { ascending: true })
      .range(from, to);
    if (error) throw error;

    allRows.push(...(data || []));

    // if fewer than pageSize returned, we are done
    if (!data || data.length < pageSize) break;

    from += pageSize;
  }

  // build area grouping from township -> district using sorted data
  const areasMap: Record<
    string,
    { id: string; title: string; options: Array<{ id: string; name: string }> }
  > = {};

  (allRows || []).forEach((s: any) => {
    const township = s?.township;
    const district = township?.district;
    if (!township || !district) return;

    const districtId = String(district.id ?? "");
    const districtTitle = district.name ?? "";

    if (!areasMap[districtId]) {
      areasMap[districtId] = {
        id: districtId,
        title: districtTitle,
        options: [],
      };
    }

    const townshipId = String(township.id ?? "");
    const townshipName = township.township_mm || township.township_en || "";

    // avoid duplicates
    if (
      !areasMap[districtId].options.some((opt) => String(opt.id) === townshipId)
    ) {
      areasMap[districtId].options.push({ id: townshipId, name: townshipName });
    }
  });

  let areas = Object.values(areasMap);

  // sort options inside each area and sort areas by title
  areas.forEach((a) => {
    a.options.sort((x, y) => String(x.name).localeCompare(String(y.name)));
  });
  areas.sort((a, b) => String(a.title).localeCompare(String(b.title)));

  return {
    data: allRows,
    areas,
  };
};

export default getStops;
