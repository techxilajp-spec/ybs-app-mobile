export type Route = {
  agency_id: string;
  color: string;
  name: string;
  route_id: string;
  shape: {
    type: string;
    geometry: {
      type: string;
      coordinates: [number, number][];
    };
    properties: Record<string, any>;
  };
  stops: number[];
};
