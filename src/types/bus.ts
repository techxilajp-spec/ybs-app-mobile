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
    title_mm: string;
    title_en: string;
    road_mm: string;
    road_en: string;
    lat: number;
    lng: number;
    coordinate?: {
        latitude: number;
        longitude: number;
    };
    isFavourite: boolean;
}

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
