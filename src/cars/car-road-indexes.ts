import type { MapConfig } from "../config";
import type { State } from "../state";

import { ANGLE } from "./spawn";

export function updateCarRoadIndexes(state: State, mapConfig: MapConfig) {
  const cars = state.cars;

  const maxAvenueIndex = state.avenuesX.length - 1;
  const maxStreetIndex = state.streetsY.length - 1;

  for (const car of cars) {
    const avenue = state.avenuesX[car.avenueIndex];
    const street = state.streetsY[car.streetIndex];

    if (avenue === undefined) {
      throw new Error(`Invalid Avenue Index: ${car.avenueIndex.toString()}`);
    }
    if (street === undefined) {
      throw new Error(`Invalid Street Index: ${car.streetIndex.toString()}`);
    }

    switch (car.angle) {
      case ANGLE.east:
        if (isPassedUpcomingIntersection(car.x, avenue - mapConfig.halfAve, true)) {
          car.avenueIndex = normaliseIncrement(car.avenueIndex, maxAvenueIndex);
        }
        break;
      case ANGLE.north:
        if (isPassedUpcomingIntersection(car.y, street - mapConfig.halfSt, true)) {
          car.streetIndex = normaliseIncrement(car.streetIndex, maxStreetIndex);
        }
        break;
      case ANGLE.south:
        if (isPassedUpcomingIntersection(car.y, street + mapConfig.halfSt, false)) {
          car.streetIndex = normaliseDecrement(car.streetIndex);
        }
        break;
      case ANGLE.west:
        if (isPassedUpcomingIntersection(car.x, avenue + mapConfig.halfAve, false)) {
          car.avenueIndex = normaliseDecrement(car.avenueIndex);
        }
        break;
      default:
        throw new Error(`Invalid Car Angle: ${car.angle.toString()}`);
    }
  }
}

function isPassedUpcomingIntersection(
  value: number,
  nextIntersectionValue: number,
  isDirectionAscending: boolean
): boolean {
  if (isDirectionAscending) {
    return value > nextIntersectionValue;
  } else {
    return value < nextIntersectionValue;
  }
}

function normaliseDecrement(value: number): number {
  if (value <= 0) {
    return 0;
  }
  return value - 1;
}

function normaliseIncrement(value: number, limit: number): number {
  if (value >= limit) {
    return limit;
  }
  return value + 1;
}
