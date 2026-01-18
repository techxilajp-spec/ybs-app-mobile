import { LatLng } from "react-native-maps";

export type Stop = {
  id: string | number;
  name: string;
  road: string;
  coordinate: LatLng;
};

export type Route = {
  id: string | number;
  no: string;
  name: string;
  description: string;
  color: string;
  coordinates: LatLng[];
  stops: Stop[];
  isYps?: boolean;
};

export type WalkInstruction = {
  type: "walk"; // discriminator
  description: string;
}

export type BusInstruction = {
  type: "bus"; // discriminator
  busNo: string;
  busTitle: string;
  startStop: string;
  endStop: string;
}

// Mixed list of instructions
export type Instruction = WalkInstruction | BusInstruction;

export type RouteSearchResult = {
  id: number;
  isFastest: boolean;
  totalBusStop: number;
  estimatedTime: number;
  routes: Route[];
  instructions: Instruction[];
};
