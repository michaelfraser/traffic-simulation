import type { Car } from "../state";

import { mapConfig } from "../config";

const streetIndex = 5;
const avenueIndex = 0;

const y = 940 + (mapConfig.halfSt/2);
export const seedCars: Car[] = [
  {
    angle: 0,
    avenueIndex,
    colour: "#ef4444",
    id: 1,
    length: 8,
    speed: 2,
    streetIndex,
    width: 4,
    x: 20,
    y,
  },

  {
    angle: 0,
    avenueIndex,
    colour: "#ef4444",
    id: 2,
    length: 8,
    speed: 2,
    streetIndex,
    width: 4,
    x: 10,
    y,
  },

  {
    angle: 0,
    avenueIndex,
    colour: "#ef4444",
    id: 3,
    length: 8,
    speed: 2,
    streetIndex,
    width: 4,
    x: 0,
    y,
  },
];
