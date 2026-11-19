import type { MapConfig } from "../config";
import type { State } from "../state";

import { getRandomAvenue, getRandomStreet, isTravellingEast } from "../utils";

export interface Road {
  index: number,
  value: number
}

export const ANGLE = {
  east: 0,
  north: 90,
  south: 270,
  west: 180,
};

const CAR_SPECS = {
  length: 8,
  speed: 2,
  width: 4,
};

const CAR_COLOURS = {
  blue: "#3b82f6",
  green: "#10b981",
  red: "#ef4444",
  yellow: "#f59e0b",
};

const SPAWN_INTERVAL = 8;
const MAX_CARS = 400;
const NUMBER_OF_CARS_TO_SPAWN = 10;

let spawnTimer = 8;

// Test Helper
export function __testResetSpawnTimer(value = 8): void {
  spawnTimer = value;
}

export function spawnCars(
  state: State,
  mapConfig: MapConfig,
  numberOfCars: number = NUMBER_OF_CARS_TO_SPAWN,
): void {
  spawnTimer++;
  if (spawnTimer < SPAWN_INTERVAL) return;
  spawnTimer = 0;

  if (guardAgainstOverpopulation(state)) {
    return;
  }

  for (let i = 0; i < numberOfCars; i++) {
    spawnNewCar(state, mapConfig);
  }
}

function getAvenueSpawnProps(state: State, mapConfig: MapConfig) {
  const { bounds } = mapConfig;
  const { index: avenueIndex, value: avenueX } = getRandomAvenue(state.avenuesX);
  const goingNorth = isRandomChoice();
  const ave = mapConfig.avenueWidth / 4;
  const carWidth = 4;

  let laneOffset = isRandomChoice() ? ave - carWidth : ave + carWidth;

  if (!goingNorth) {
    laneOffset = -1 * laneOffset;
  }

  return {
    angle: goingNorth ? ANGLE.north : ANGLE.south,
    avenueIndex: avenueIndex,
    colour: goingNorth ? CAR_COLOURS.blue : CAR_COLOURS.green,
    streetIndex: goingNorth ? 0 : state.streetsY.length - 1,
    x: goingNorth ? avenueX + laneOffset : avenueX + laneOffset,
    y: goingNorth ? bounds.minY : bounds.maxY,
  };
}

function getCarId(): number {
  return Math.random() * 1000000;
}

function getStreetSpawnProps(state: State, mapConfig: MapConfig) {
  const { bounds, halfSt } = mapConfig;
  const { index, value: streetY } = getRandomStreet(state.streetsY);
  const isEastbound = isTravellingEast(index);
  const laneOffset = halfSt * (isRandomChoice() ? -0.5 : 0.5);

  return {
    angle: isEastbound ? ANGLE.east : ANGLE.west,
    avenueIndex: isEastbound ? 0 : state.avenuesX.length - 1,
    colour: isEastbound ? CAR_COLOURS.red : CAR_COLOURS.yellow,
    streetIndex: index,
    x: isEastbound ? bounds.minX : bounds.maxX,
    y: streetY + laneOffset,
  };
}

function guardAgainstOverpopulation(state: State): boolean {
  return state.cars.length > MAX_CARS;
}

function isRandomChoice(): boolean {
  return Math.random() < 0.5;
}

function spawnNewCar(state: State, mapConfig: MapConfig): void {
  const spawnOnAvenue = isRandomChoice();

  const spawnProps = spawnOnAvenue
    ? getAvenueSpawnProps(state, mapConfig)
    : getStreetSpawnProps(state, mapConfig);

  state.cars.push({
    id: getCarId(),
    ...spawnProps,
    ...CAR_SPECS,
  });
}
