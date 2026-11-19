import type { MapConfig } from "../../src/config";
import type { Car, State } from "../../src/state";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { __testResetSpawnTimer, ANGLE, spawnCars } from "../../src/cars/spawn";

describe("Car Spawning Module", () => {
  let mockState: State;
  let mockMapConfig: MapConfig;

  beforeEach(() => {
    vi.restoreAllMocks();

    __testResetSpawnTimer();

    mockState = {
      avenuesX: [100, 200, 300],
      cars: [],
      streetsY: [150, 250, 350],
    } as unknown as State;

    mockMapConfig = {
      bounds: {
        maxX: 500,
        maxY: 500,
        minX: 0,
        minY: 0,
      },
      halfAve: 20,
      halfSt: 20,
    } as unknown as MapConfig;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Timer Throttling & Overpopulation Guard", () => {
    it("should respect spawn timer throttling and skip spawning when timer is below interval", () => {
      // 1st call: spawnTimer starts at 8 -> increments to 9 (>= 8), spawns cars, resets timer to 0
      vi.spyOn(Math, "random").mockReturnValue(0.1);
      spawnCars(mockState, mockMapConfig, 2);
      expect(mockState.cars.length).toBe(2);

      // 2nd call immediately: spawnTimer is 0 -> increments to 1 (< 8), skips spawn
      spawnCars(mockState, mockMapConfig, 2);
      expect(mockState.cars.length).toBe(2);
    });

    it("should trigger overpopulation warning and skip spawning if MAX_CARS is exceeded", () => {
      // Force state to exceed MAX_CARS (400)
      mockState.cars = Array.from(
        { length: 401 },
        () =>
          ({
            angle: ANGLE.east,

            avenueIndex: 0,
            colour: "#ef4444",
            streetIndex: 0,
            y: 240,
          }) as Car
      );
      
      // 1st call: timer passes (8 -> 9), but overpopulation guard catches it
      spawnCars(mockState, mockMapConfig, 5);

      expect(mockState.cars.length).toBe(401);
    });
  });

  describe("Car Generation Properties", () => {
    it("should correctly spawn an Avenue car traveling North", () => {
      let callSeq = 0;
      vi.spyOn(Math, "random").mockImplementation(() => {
        callSeq++;
        if (callSeq === 1) return 0.1; // spawnOnAvenue = true
        if (callSeq === 2) return 0.1; // getRandomRoad index
        if (callSeq === 3) return 0.6; // goingNorth = false
        return 0.5;
      });

      // Advance timer past threshold
      spawnCars(mockState, mockMapConfig, 1);

      expect(mockState.cars.length).toBe(1);
      const car = mockState.cars[0]!;
      expect(car.angle).toBe(ANGLE.south);
      expect(car.colour).toBe("#10b981");
      expect(car.avenueIndex).toBe(0);
      expect(car.streetIndex).toBe(2);
      expect(car.length).toBe(8);
      expect(car.width).toBe(4);
      expect(car.speed).toBe(2);
    });
    it("should correctly spawn an Avenue car traveling South", () => {
      let callSeq = 0;
      vi.spyOn(Math, "random").mockImplementation(() => {
        callSeq++;
        if (callSeq === 1) return 0.1; // spawnOnAvenue = true
        if (callSeq === 2) return 0.1; // getRandomRoad index (picks avenuesX[0] = 100)
        if (callSeq === 3) return 0.1; // goingSouth = true
        return 0.5;
      });

      // Advance timer past threshold
      spawnCars(mockState, mockMapConfig, 1);

      expect(mockState.cars.length).toBe(1);
      const car = mockState.cars[0]!;
      expect(car.angle).toBe(ANGLE.north);
      expect(car.colour).toBe("#3b82f6");
      expect(car.avenueIndex).toBe(0);
      expect(car.streetIndex).toBe(0);
      expect(car.length).toBe(8);
      expect(car.width).toBe(4);
      expect(car.speed).toBe(2);
    });
    it("should correctly spawn a Street car traveling West (odd street index)", () => {
      let callSeq = 0;
      vi.spyOn(Math, "random").mockImplementation(() => {
        callSeq++;
        if (callSeq === 1) return 0.9; // spawnOnAvenue = false
        if (callSeq === 2) return 0.0; // getRandomRoad index -> index 0
        if (callSeq === 3) return 0.2; // isEastbound
        if (callSeq === 4) return 0.2; // Laneoffset
        return 0.5;
      });

      spawnCars(mockState, mockMapConfig, 1);

      expect(mockState.cars.length).toBe(1);
      const car = mockState.cars[0]!;

      expect(car.angle).toBe(ANGLE.west);
      expect(car.colour).toBe("#f59e0b");
      expect(car.streetIndex).toBe(0);
      expect(car.avenueIndex).toBe(2);
      expect(car.y).toBe(140);
    });

    it("should correctly spawn a Street car traveling East (even street index)", () => {
      let callSeq = 0;
      vi.spyOn(Math, "random").mockImplementation(() => {
        callSeq++;
        if (callSeq === 1) return 0.9; // spawnOnAvenue = false
        if (callSeq === 2) return 0.4; // getRandomRoad index -> index 1
        if (callSeq === 3) return 0.7; // LaneOffSet

        return 0.5;
      });

      spawnCars(mockState, mockMapConfig, 1);

      expect(mockState.cars.length).toBe(1);
      const car = mockState.cars[0]!;

      expect(car).toBeDefined();
      expect(car.streetIndex).toBe(1);
      expect(car.avenueIndex).toBe(0);
      expect(car.angle).toBe(ANGLE.east);
      expect(car.colour).toBe("#ef4444");
      expect(car.y).toBe(260);
    });
  });
});
