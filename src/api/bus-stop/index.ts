import getAreas from "./getArea";
import getBusStops from "./getBusStops";
import getStops from "./getStop";
import getStopDetail from "./getStopDetail";
import getStopsWithBusNumber from "./getStopWithBusNumber";
import increaseStopView from "./increaseStopView";

const busStopApi = {
  getBusStops,
  getAreas,
  getStopsWithBusNumber,
  increaseStopView,
  getStops,
  getStopDetail,
};

export default busStopApi;
