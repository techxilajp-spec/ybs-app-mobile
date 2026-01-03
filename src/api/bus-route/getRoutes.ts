import { supabase } from "@/src/utils/supabase";

const getRoutes = async () => {
  const { data, error } = await supabase.from("routes").select(`
    id,
    name,
    number_en,
    color,
    is_yps
  `);

  if (error) {
    console.error("Error fetching routes:", error);
    throw new Error(error.message);
  }

  return {
    data,
  };
};

export default getRoutes;
