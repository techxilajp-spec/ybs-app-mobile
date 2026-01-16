import { Accordian } from "@/src/types/accordian";
import { supabase } from "@/src/utils/supabase";

const getAreas = async (): Promise<Accordian[]> => {
  // Fetch townships with their district information
  const { data: townships, error } = await supabase
    .from("township")
    .select(
      `
      id,
      township_mm,
      township_en,
      district_id,
      district:district_id (
        id,
        name
      )
    `
    )
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  // Group townships by district
  const areasMap: Record<
    string,
    { id: string; title: string; options: { id: string; name: string }[] }
  > = {};

  (townships || []).forEach((township: any) => {
    const district = township?.district;
    if (!district) return;

    const districtId = String(district.id);
    if (!areasMap[districtId]) {
      areasMap[districtId] = {
        id: districtId,
        title: district.name,
        options: [],
      };
    }

    const townshipId = String(township.id);
    const townshipName = township.township_mm || township.township_en || "";

    // Avoid duplicate townships
    if (
      !areasMap[districtId].options.some((opt) => String(opt.id) === townshipId)
    ) {
      areasMap[districtId].options.push({
        id: townshipId,
        name: townshipName,
      });
    }
  });

  const areas = Object.values(areasMap);

  // Sort options within each area
  areas.forEach((a) => a.options.sort((x, y) => x.name.localeCompare(y.name)));
  // Sort areas by title
  areas.sort((a, b) => a.title.localeCompare(b.title));

  return areas;
};

export default getAreas;
