import type { MapConfig } from "../../src/config";
import type { Car, State } from "../../src/state";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { removeOutOfBoundsCars } from "../../src/cars/remove-out-of-bounds-cars";
import { seedCars } from "../../src/cars/seed";
import { ANGLE } from "../../src/cars/spawn";

describe("updateCars Simulation Logic", () => {
  let mockMapConfig: MapConfig;
  let mockState: State;
  let mockActiveCar: Car;

  beforeEach(() => {
    vi.clearAllMocks();

    mockMapConfig = {
      avenueWidth: 44,
      bounds: {
        maxX: 984,
        maxY: 968,
        minX: 16,
        minY: 32,
      },
      cols: 6,
      halfAve: 22,
      halfSt: 14,
      padding: 60,
      rows: 6,
      streetWidth: 28,
      worldHeight: 1000,
      worldWidth: 1000,
    };

    mockState = {
      avenuesX: new Float32Array([60, 236, 412, 588, 764, 940]),
      cars: seedCars,
      intersections: [],
      lightPhase: 0,
      lightTimer: 0,
      streetsY: new Float32Array([60, 236, 412, 588, 764, 940]),
    };

    mockActiveCar = {
      angle: ANGLE.north,
      avenueIndex: 0,
      colour: "#000",
      id: 1,
      length: 8,
      speed: 5,
      streetIndex: 0,
      width: 4,
      x: 200,
      y: 200,
    };
  });

  it("should keep cars that are well within the boundaries", () => {
    const car1: Car = { ...mockActiveCar, x: 150, y: 150 };
    const car2: Car = { ...mockActiveCar, x: 500, y: 500 };

    const state: State = { ...mockState, cars: [car1, car2] };

    removeOutOfBoundsCars(state, mockMapConfig);

    expect(state.cars).toHaveLength(2);
    expect(state.cars).toEqual([car1, car2]);
  });

  it("should correctly keep cars sitting exactly on the boundary thresholds (inclusive)", () => {
    const car1: Car = { ...mockActiveCar, x: 16, y: 32 };
    const car2: Car = { ...mockActiveCar, x: 16, y: 968 };
    const car3: Car = { ...mockActiveCar, x: 984, y: 32 };
    const car4: Car = { ...mockActiveCar, x: 984, y: 968 };

    const state: State = { ...mockState, cars: [car1, car2, car3, car4] };

    removeOutOfBoundsCars(state, mockMapConfig);

    expect(state.cars).toHaveLength(4);
    expect(state.cars).toEqual([car1, car2, car3, car4]);
  });

  it("should remove all cars as they are 1px beyond the boundary", () => {
    const car1: Car = { ...mockActiveCar, x: 15, y: 32 };
    const car2: Car = { ...mockActiveCar, x: 16, y: 31 };
    const car3: Car = { ...mockActiveCar, x: 16, y: 969 };
    const car4: Car = { ...mockActiveCar, x: 985, y: 32 };
    const car5: Car = { ...mockActiveCar, x: 984, y: 31 };
    const car6: Car = { ...mockActiveCar, x: 985, y: 968 };
    const car7: Car = { ...mockActiveCar, x: 984, y: 969 };

    const state: State = { ...mockState, cars: [car1, car2, car3, car4, car5, car6, car7] };

    removeOutOfBoundsCars(state, mockMapConfig);
    expect(state.cars).toHaveLength(0);
    expect(state.cars).toEqual([]);
  });

  it("should remove cars that drift out of bounds past the buffer", () => {
    const activeCar: Car = {
      angle: ANGLE.north,
      avenueIndex: 0,
      colour: "#000",
      id: 1,
      length: 40,
      speed: 5,
      streetIndex: 0,
      width: 8,
      x: 200,
      y: 200,
    };

    const outOfBoundsCar: Car = {
      angle: ANGLE.north,
      avenueIndex: 0,
      colour: "#000",
      id: 1,
      length: 40,
      speed: 5,
      streetIndex: 0,
      width: 8,
      x: 9999,
      y: 9999,
    };

    mockState.cars = [activeCar, outOfBoundsCar];

    removeOutOfBoundsCars(mockState, mockMapConfig);

    expect(mockState.cars).toHaveLength(1);
    expect(mockState.cars[0]).toEqual(activeCar);
  });
});
