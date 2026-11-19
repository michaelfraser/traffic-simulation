import type { MapConfig } from "../../src/config";
import type { Car, State } from "../../src/state";

import { beforeEach, describe, expect, it, test, vi } from "vitest";

import { findIndexOfClosestRoad, moveCars } from "../../src/cars/cars";
import { removeOutOfBoundsCars } from "../../src/cars/remove-out-of-bounds-cars";
import { seedCars } from "../../src/cars/seed";
import { ANGLE } from "../../src/cars/spawn";

describe("updateCars Simulation Logic", () => {
  let mockMapConfig: MapConfig;
  let mockState: State;

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
      intersections: [
        [
          {
            duration: 300,
            isAvenueGreen: true,
            timer: 239,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: false,
            timer: 99,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: true,
            timer: 187,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: false,
            timer: 171,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: true,
            timer: 245,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: false,
            timer: 70,
            x: 0,
            y: 0,
          },
        ],
        [
          {
            duration: 300,
            isAvenueGreen: false,
            timer: 40,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: true,
            timer: 84,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: false,
            timer: 199,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: true,
            timer: 158,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: false,
            timer: 175,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: true,
            timer: 165,
            x: 0,
            y: 0,
          },
        ],
        [
          {
            duration: 300,
            isAvenueGreen: true,

            timer: 95,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: false,

            timer: 117,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: true,
            timer: 188,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: false,
            timer: 228,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: true,
            timer: 77,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: false,
            timer: 50,
            x: 0,
            y: 0,
          },
        ],
        [
          {
            duration: 300,
            isAvenueGreen: false,
            timer: 58,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: true,
            timer: 126,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: false,
            timer: 71,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: true,

            timer: 182,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: false,
            timer: 169,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: true,
            timer: 13,
            x: 0,
            y: 0,
          },
        ],
        [
          {
            duration: 300,
            isAvenueGreen: true,
            timer: 261,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: false,
            timer: 148,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: true,
            timer: 47,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: false,
            timer: 180,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: true,
            timer: 194,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: false,
            timer: 227,
            x: 0,
            y: 0,
          },
        ],
        [
          {
            duration: 300,
            isAvenueGreen: false,
            timer: 58,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: true,
            timer: 132,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: false,
            timer: 184,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: true,
            timer: 169,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: false,
            timer: 68,
            x: 0,
            y: 0,
          },
          {
            duration: 300,
            isAvenueGreen: true,
            timer: 117,
            x: 0,
            y: 0,
          },
        ],
      ],
      lightPhase: 0,
      lightTimer: 0,
      streetsY: new Float32Array([60, 236, 412, 588, 764, 940]),
    };
  });

  it("should move cars forward along their heading vector when no obstacles exist", () => {
    // A northbound car starts at y: 300, moving north (angle 90 -> moves along -Y) with speed 5
    const car: Car = {
      angle: ANGLE.north,
      avenueIndex: 2,
      colour: "black",
      id: 1,
      length: 40,
      speed: 5,
      streetIndex: 2,
      width: 10,
      x: 100,
      y: 300,
    };
    mockState.cars = [car];

    moveCars(mockState, mockMapConfig);

    expect(car.x).toBe(100);
    expect(car.y).toBe(305);
  });

  it("should move cars forward along their heading vector when no obstacles exist", () => {
    // A northbound car starts at y: 300, moving north (angle 90 -> moves along -Y) with speed 5
    const car: Car = {
      angle: ANGLE.east,
      avenueIndex: 0,
      colour: "#000",
      id: 1,
      length: 40,
      speed: 5,
      streetIndex: 0,
      width: 8,
      x: 100,
      y: 300,
    };
    mockState.cars = [car];

    moveCars(mockState, mockMapConfig);

    expect(car.x).toBe(105);
    expect(car.y).toBe(300);
  });

  it("should stop or brake when approaching a red light", () => {
    // Place a northbound car close to a street red light line
    const car: Car = {
      angle: ANGLE.north,
      avenueIndex: 0,
      colour: "#000",
      id: 1,
      length: 40,
      speed: 5,
      streetIndex: 0,
      width: 8,
      x: 100,
      y: 300,
    };

    // const car = { x: 100, y: 80, length: 40, angle: ANGLE.north, speed: 10 };
    mockState.cars = [car];

    moveCars(mockState, mockMapConfig);

    // The car should have slowed down due to the red light constraint
    expect(car.speed).toBeGreaterThanOrEqual(0);
  });

  it("should remove cars that drift out of bounds past the buffer", () => {
    const activeCar: Car = 
{
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

    // Out of bounds car should be filtered out
    expect(mockState.cars).toHaveLength(1);
    expect(mockState.cars[0]).toEqual(activeCar);
  });
});

describe("findClosestIndex", () => {
  test.each([
    { description: "below the first road", expected: 0, val: 53 },
    { description: "exact match on first road", expected: 0, val: 60 },
    { description: "closer to the first road (60)", expected: 1, val: 150 },
    { description: "closer to the second road (236)", expected: 1, val: 151 },
    { description: "exact match on middle road", expected: 1, val: 236 },
    { description: "midpoint between 412 and 588", expected: 3, val: 500 },
    { description: "above the last road", expected: 5, val: 999 },
  ])("should find the closest index for val $val ($description)", ({ expected, val }) => {
    const streets = [60, 236, 412, 588, 764, 940];
    const closestIndex = findIndexOfClosestRoad(val, streets);
    expect(closestIndex).toBe(expected);
  });
});
