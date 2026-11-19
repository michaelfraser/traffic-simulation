import type { MapConfig } from "../config";
import type { Car, State } from "../state";
import type { UpcomingTrafficLight } from "../world/upcoming-traffic-light";

import { ANGLE } from "../cars/spawn";
import { isIntersectionExitGridLocked } from "../intersection/is-exit-grid-locked";
import { applyStopLineConstraint } from "../intersection/stop-line-constraint";
import { isOnAvenue, isTravellingEast } from "../utils";
import { getUpcomingTrafficLightInfo } from "../world/upcoming-traffic-light";

export function calculateSpeedAtTrafficLight(state: State, mapConfig: MapConfig, car: Car): number {
  const info = getUpcomingTrafficLightInfo(state, car);

  if (isOnAvenue(car.angle)) {
    return avenueFunction(state, mapConfig, car, info);
  } else {
    return streetFunction(state, mapConfig, car, info);
  }
}

function avenueFunction(
  state: State,
  mapConfig: MapConfig,
  car: Car,
  info: UpcomingTrafficLight
): number {
  const isGreenLight = info.isAvenueGreen;

  if (isGreenLight) {
    const exitGridLocked = isIntersectionExitGridLocked(state, car);

    if (exitGridLocked) {
      return 0;
    } else {
      return car.speed;
    }
  } else {
    const stopLinePos = getStopLinePos(
      state.streetsY,
      info.streetIndex,
      car.angle === ANGLE.north,
      mapConfig.halfSt
    );

    return applyStopLineConstraint(car, true, stopLinePos);
  }
}

function getStopLinePos(
  roads: Float32Array,
  roadIndex: number,
  isPostiveDirection: boolean,
  halfRoadWidth: number
): number {
  const road = roads[roadIndex];

  if (!road) throw new Error(`Invalid value [${roadIndex.toString()}]`);

  return isPostiveDirection ? road - halfRoadWidth : road + halfRoadWidth;
}

function streetFunction(
  state: State,
  mapConfig: MapConfig,
  car: Car,
  info: UpcomingTrafficLight
): number {
  const isStreetGreenLight = !info.isAvenueGreen;

  if (isStreetGreenLight) {
    const exitGridLocked = isIntersectionExitGridLocked(state, car);
    if (exitGridLocked) {
      return 0;
    } else {
      return car.speed;
    }
  } else {
    const stopLinePos = getStopLinePos(
      state.avenuesX,
      info.avenueIndex,
      isTravellingEast(info.streetIndex),
      mapConfig.halfAve
    );
    return applyStopLineConstraint(car, false, stopLinePos);
  }
}
