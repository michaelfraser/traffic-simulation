import type { Car, State } from "../state";

import { isAvenueTrafficLightGreen } from "../utils";

export interface UpcomingTrafficLight {
  avenueIndex: number;
  isAvenueGreen: boolean;
  streetIndex: number;
}

export function getUpcomingTrafficLightInfo(state: State, car: Car): UpcomingTrafficLight {
  const isAvenueGreen = isAvenueTrafficLightGreen(state, car.avenueIndex, car.streetIndex,);

  return {
    avenueIndex: car.avenueIndex,
    isAvenueGreen: isAvenueGreen,
    streetIndex: car.streetIndex,
  };
}
