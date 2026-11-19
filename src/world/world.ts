import type { MapConfig } from "../config";
import type { Intersection, State } from "../state";

export const DEFAULT_LIGHT_DURATION = 300;

export function setupGrid(state: State, mapConfig: MapConfig): void {
  createRoads(state, mapConfig);
  createIntersections(state);

  const firstAvenue = state.avenuesX[0];
  const lastAvenue = state.avenuesX[state.avenuesX.length - 1];
  const firstStreet = state.streetsY[0];
  const lastStreet = state.streetsY[state.streetsY.length - 1];

  if (
    firstAvenue === undefined ||
    lastAvenue === undefined ||
    firstStreet === undefined ||
    lastStreet === undefined
  ) {
    throw new Error("Cannot calculate bounds for an empty road grid");
  }

  const buffer = 40;

  mapConfig.bounds = {
    maxX: lastAvenue + mapConfig.avenueWidth / 2 + buffer,
    maxY: lastStreet + mapConfig.streetWidth / 2 + buffer,
    minX: firstAvenue - mapConfig.avenueWidth / 2 - buffer,
    minY: firstStreet - mapConfig.streetWidth / 2 - buffer,
  };
}

export function updateTrafficLights(state: State): void {
  state.intersections.forEach((street) => {
    street.forEach((light) => {
      light.timer++;
      if (light.timer >= light.duration) {
        light.timer = 0;
        light.isAvenueGreen = !light.isAvenueGreen;
      }
    });
  });
}

function calculateSpacing(mapConfig: MapConfig) {
  const usableWidth = mapConfig.worldWidth - mapConfig.padding * 2;
  const usableHeight = mapConfig.worldHeight - mapConfig.padding * 2;
  const avenueSpacing = mapConfig.cols > 1 ? usableWidth / (mapConfig.cols - 1) : 0;
  const streetSpacing = mapConfig.rows > 1 ? usableHeight / (mapConfig.rows - 1) : 0;
  return { avenueSpacing, streetSpacing };
}

function createIntersections(state: State): void {
  state.intersections = [];

  state.avenuesX.forEach((x, a) => {
    const row: Intersection[] = [];
    state.streetsY.forEach((y, s) => {
      row.push({
        duration: 300,
        isAvenueGreen: (a + s) % 2 === 0,
        timer: Math.floor(Math.random() * 300),
        x,
        y,
      });
    });
    state.intersections.push(row);
  });
}

function createRoadArray(rows: number, padding: number, spacing: number): Float32Array {
  const roads = new Float32Array(rows);

  for (let i = 0; i < rows; i++) {
    roads[i] = padding + i * spacing;
  }

  return roads;
}

function createRoads(state: State, mapConfig: MapConfig): void {
  const { avenueSpacing, streetSpacing } = calculateSpacing(mapConfig);

  state.avenuesX = createRoadArray(mapConfig.cols, mapConfig.padding, avenueSpacing);
  state.streetsY = createRoadArray(mapConfig.rows, mapConfig.padding, streetSpacing);
}
