import type { MapConfig } from "../config";
import type { Car, State } from "../state";

import { calculateSpeedAtTrafficLight } from "../intersection/calculate-speed-at-traffic-light";
import { applyFollowingCarConstraint } from "./apply-following-car-constraint";

/*
  Helper function to find the closest index in a sorted array.
  This is a binary search implementation that returns the index of the closest value 
  to 'val' in 'roads'.  Which finds the closest road (street or avenue) to the car's current position.
*/
export function findIndexOfClosestRoad(val: number, roads: number[]): number {
  const len = roads.length;
  if (len === 0) return 0;
  const firstRoad = get(0, roads);
  const lastRoad = get(len - 1, roads);

  if (val <= firstRoad) return 0;
  if (val >= lastRoad) return len - 1;

  let low = 0;
  let high = len - 1;

  while (low <= high) {
    const mid = (low + high) >> 1; // Bitwise shift for fast integer division
    const pos = roads[mid];

    if (pos === undefined) {
      throw new Error("Invalid value");
    }

    if (pos === val) return mid;
    if (pos < val) low = mid + 1;
    else high = mid - 1;
  }

  const highRoad = get(high, roads);
  const lowRoad = get(low, roads);

  // When the loop ends, 'high' is the closest element below val,
  // and 'low' is the closest element above val. Compare the two:
  return Math.abs(highRoad - val) < Math.abs(lowRoad - val) ? high : low;
}

export function moveCars(state: State, mapConfig: MapConfig): void {
  state.cars.forEach((car) => {
    moveCar(state, mapConfig, car);
  });
}

function get(index: number, roads: number[]): number {
  const value = roads[index];

  if (value === undefined) {
    throw new Error("Invalid value");
  }
  return value;
}

function moveCar(state: State, mapConfig: MapConfig, car: Car): void {
  // 1. Check distance to stop line at traffic lights

  // TODO improve the hack for initial speed updating.
  if (car.speed < 1) {
    car.speed = 2;
  }

  const lightSpeed = calculateSpeedAtTrafficLight(state, mapConfig, car);

  const followSpeed = applyFollowingCarConstraint(state.cars, car);

  const speed = Math.min(lightSpeed, followSpeed);

  const normalisedSpeed = speed > 0 ? (speed < 0.5 ? 0.5 : speed) : 0;

  // Move car along its heading vector
  const rad = (car.angle * Math.PI) / 180;

  car.x += Math.cos(rad) * normalisedSpeed;
  car.y += Math.sin(rad) * normalisedSpeed;

  car.speed = normalisedSpeed;
}
