import { supabase } from "@/src/utils/supabase";

const increaseStopView = async (stopId: number) => {
  let { data, error } = await supabase.rpc("increment_stop_view", {
    p_stop_id: stopId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export default increaseStopView;
