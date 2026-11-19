import type { Car } from "../state";

import { isOnAvenue } from "../utils";
import { ANGLE } from "./spawn";

export interface CarAhead {
  car: Car;
  gap: number;
}

export interface NextRoad {
  avenueIndex: number;
  streetIndex: number;
}

/*
  Find the car infront which is on the same road.
*/  
export function findCarAhead(cars: Car[], car: Car): CarAhead | undefined {
  const laneTolerance = 5; // Lateral pixel tolerance to confirm same lane
  const nextRoad = getNextRoadIndexes(car);
  const isAvenue = isOnAvenue(car.angle);
  let carInFront: Car | undefined = undefined;
  let minGap = Infinity;
  let isSameLane: boolean;

  for (const potentialCar of cars) {
    if (canSkipPotentialCar(car, potentialCar, nextRoad)) continue;

    let gap = -1;

    if (isAvenue) {
      isSameLane = Math.abs(car.x - potentialCar.x) < laneTolerance;
      if (isSameLane) {
        gap =
          car.angle === ANGLE.north
            ? potentialCar.y - car.y - car.length
            : car.y - potentialCar.y - car.length;
      }
    } else {
      const isEastBound = car.angle === ANGLE.east;
      isSameLane = Math.abs(car.y - potentialCar.y) < laneTolerance;
      if (isSameLane) {
        if (isEastBound) {
          if (potentialCar.x < car.x) {
            continue;
          }
          gap = potentialCar.x - car.x;
        } else {
          if (potentialCar.x > car.x) {
            continue;
          }
          gap = potentialCar.x - car.x;
        }

        gap = Math.abs(gap) - car.length;
      }
    }

    if (isSameLane && gap >= -2 && gap < minGap) {
      minGap = gap;
      carInFront = potentialCar;
    }
  }
  return carInFront ? { car: carInFront, gap: minGap } : undefined;
}
function canSkipPotentialCar(car: Car, potentialCar: Car, nextRoad: NextRoad): boolean {

  if (car.angle !== potentialCar.angle) return true;

  if (car.id === potentialCar.id) return true;

  if (
    car.avenueIndex === potentialCar.avenueIndex &&
    car.streetIndex === potentialCar.streetIndex
  ) {
    return false;
  }

  if (
    potentialCar.avenueIndex === nextRoad.avenueIndex &&
    potentialCar.streetIndex === nextRoad.streetIndex
  ) {
    return false;
  }

  return false;
}
/*
  Get the index for the next section of road in the direction the car is travelling
*/
function getNextRoadIndexes(car: Car): NextRoad {
  switch (car.angle) {
    case ANGLE.east:
      return { avenueIndex: car.avenueIndex + 1, streetIndex: car.streetIndex };
    case ANGLE.north:
      return { avenueIndex: car.avenueIndex, streetIndex: car.streetIndex + 1 };
    case ANGLE.south:
      return { avenueIndex: car.avenueIndex, streetIndex: car.streetIndex - 1 };
    case ANGLE.west:
      return { avenueIndex: car.avenueIndex - 1, streetIndex: car.streetIndex };
    default:
      throw new Error(`Invalid car angle: ${car.angle.toString()}`);
  }
}
