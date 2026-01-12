export const MAP_DELTA = {
  INITIAL: {
    LATITUDE: 0.3,
    LONGITUDE: 0.3,
  },
  DEFAULT: {
    LATITUDE: 0.05,
    LONGITUDE: 0.05,
  },
  CLOSE: {
    LATITUDE: 0.01,
    LONGITUDE: 0.01,
  },
};

export const MAP_LOCATIONS = {
  YANGON: {
    latitude: 16.871311,
    longitude: 96.199379,
    latitudeDelta: MAP_DELTA.DEFAULT.LATITUDE,
    longitudeDelta: MAP_DELTA.DEFAULT.LONGITUDE,
  },
};
