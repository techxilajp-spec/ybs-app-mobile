export type Route = {
    id: string;
    no: string;
    name: string;
    description: string;
    color: string;
    isYps: boolean;
}

export type Stop = {
    id: string;
    title_mm: string;
    title_en: string;
    road_mm: string;
    road_en: string;
    lat: number;
    lng: number;
    isFavourite: boolean;
}