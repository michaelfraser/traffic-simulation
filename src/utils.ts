import type { State } from "./state";

import { ANGLE, type Road } from "./cars/spawn";
import { IntersectionNotFoundError } from "./errors/errors";

export function getRandomAvenue(avenues: Float32Array): Road {
  return getRandomRoad(avenues);
}

export function getRandomStreet(streets: Float32Array): Road {
  return getRandomRoad(streets);
}

export function isAvenueTrafficLightGreen(state: State, avenueIndex: number, streetIndex: number): boolean {
  const intersection = state.intersections[avenueIndex]?.[streetIndex];

  if (intersection) return intersection.isAvenueGreen;

  throw new IntersectionNotFoundError(avenueIndex, streetIndex);
}

export function isOnAvenue(angle: number): boolean {
  return angle === ANGLE.north || angle === ANGLE.south;
}

export function isTravellingEast(index: number): boolean {
  return (index + 1) % 2 === 0;
}

function getRandomRoad(roads: Float32Array): Road {
  const randomIndex = Math.floor(Math.random() * roads.length);
  const road = roads[randomIndex];

  if (road === undefined) {
    throw new Error("Invalid Road");
  }

  return { index: randomIndex, value: road };
}
