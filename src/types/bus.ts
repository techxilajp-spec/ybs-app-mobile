export type Route = {
  id: string;
  no: string;
  name: string;
  description: string;
  color: string;
  isYps: boolean;
};

export type Stop = {
  id: string;
  name_mm: string;
  name_en: string;
  lat: string;
  lng: string;
  // description: string;
  is_favourite: boolean;
};

export type StopDetailResponse = {
  id: string;
  nameMm: string;
  nameEn: string;
  lat: number;
  lng: number;
  townshipMm: string;
  townshipEn: string;
  roadEn: string;
  roadMm: string;
  routes: RouteResponse[];
};

export type RouteResponse = {
  routeId: number;
  routeName: string;
  routeNumberEn: string;
  routeNumberMm: string;
  isYps: boolean;
  coordinates: Array<[number, number]>;
  color: string;
};
