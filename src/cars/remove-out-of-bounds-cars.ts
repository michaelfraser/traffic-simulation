import type { MapConfig } from "../config";
import type { State } from "../state";

export function removeOutOfBoundsCars(state: State, mapConfig: MapConfig) {
  const { maxX, maxY, minX, minY } = mapConfig.bounds;
  const cars = state.cars;
  let writeIndex = 0;

  for (const car of cars) {
    if (car.x >= minX && car.x <= maxX && car.y >= minY && car.y <= maxY) {
      cars[writeIndex++] = car;
    }
  }
  
  cars.length = writeIndex;
}
