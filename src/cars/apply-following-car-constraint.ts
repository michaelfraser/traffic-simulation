import type { Car } from "../state";

import { findCarAhead } from "./find-car-ahead";
import { ANGLE } from "./spawn";

const BREAKING_DISTANCE = 8;

export function applyFollowingCarConstraint(cars: Car[], car: Car, targetGap = 2): number {
  const constraintSpeed = car.speed;
  const carAhead = findCarAhead(cars, car);
  if (!carAhead) return constraintSpeed;

  const { car: leadCar, gap } = carAhead;

  // is gap to car ahead greater than breaking distance
  if (gap > BREAKING_DISTANCE) {
    return constraintSpeed;
  }

  if (gap <= targetGap) {
    const offset = car.length + targetGap;

    switch (car.angle) {
      case ANGLE.east:
        car.x = leadCar.x - offset;
        break;

      case ANGLE.north:
        car.y = leadCar.y - offset;
        break;
        
      case ANGLE.south:
        car.y = leadCar.y + offset;
        break;

      case ANGLE.west:
        car.x = leadCar.x + offset;
        break;
    }
    return 0;
  }

  // Smooth deceleration as distance closes
  return Math.min(constraintSpeed, (gap - targetGap) * 0.15);
}
