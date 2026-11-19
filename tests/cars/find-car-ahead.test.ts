import type { Car } from "../../src/state";

import { describe, expect, it } from "vitest";

import { findCarAhead } from "../../src/cars/find-car-ahead";
import { ANGLE } from "../../src/cars/spawn";

describe("findCarAhead", () => {
  const baseCar: Car = {
    angle: 0,
    avenueIndex: 1,
    colour: "#000",
    id: 1,
    length: 8,
    speed: 2,
    streetIndex: 1,
    width: 4,
    x: 10,
    y: 10,
  };

  describe("getNextRoadIndexes & invalid angles", () => {
    it("throws an error for an invalid car angle", () => {
      const invalidCar: Car = { ...baseCar, angle: 999 };
      expect(() => findCarAhead([baseCar], invalidCar)).toThrow("Invalid car angle: 999");
    });
  });

  describe("canSkipPotentialCar logic", () => {

    it("skips cars with different angles", () => {
      const car: Car = { ...baseCar, angle: ANGLE.east, x: 10, y: 10 };
      const potentialCar: Car = { ...baseCar, angle: ANGLE.west, id: 2, x: 20, y: 10 };

      const result = findCarAhead([potentialCar], car);
      expect(result).toBeUndefined();
    });

    it("skips itself (same id)", () => {
      const result = findCarAhead([baseCar], baseCar);
      expect(result).toBeUndefined();
    });

    it("finds car located on the next road index", () => {
      // East bound car at avenueIndex: 1, streetIndex: 1. Next road is avenueIndex: 2, streetIndex: 1.
      const car: Car = {
        ...baseCar,
        x: 10,
        y: 10,
      };
      const potentialCar: Car = {
        ...baseCar,
        avenueIndex: 2,
        id: 2,
        x: 30,
        y: 10,
      };

      const result = findCarAhead([potentialCar], car);
      expect(result).toEqual({ car: potentialCar, gap: 12 });
    });
    it("does not skip cars on an unhandled/other index branch that falls through to false", () => {
      // Different avenueIndex and streetIndex that doesn't match current or next road
      const car = baseCar;
      const potentialCar: Car = {
        ...baseCar,
        avenueIndex: 5,
        id: 2,
        streetIndex: 5,
        x: 30,
        y: 10,
      };

      const result = findCarAhead([potentialCar], car);
      expect(result).toBeDefined();
    });
  });

  describe("Avenue traffic (North / South)", () => {
    it("finds a car ahead moving North within tolerance", () => {
      const car: Car = { ...baseCar, angle: ANGLE.north };
      const carAhead: Car = { ...baseCar, angle: ANGLE.north, id: 2, length: 8, x: 12, y: 30 }; // delta x = 2 (< 5 tolerance)

      // gap = potentialCar.y - car.y - car.length => 30 - 10 - 8 = 12
      const result = findCarAhead([carAhead], car);
      expect(result).toEqual({ car: carAhead, gap: 12 });
    });

    it("finds a car ahead moving South within tolerance", () => {
      const car: Car = { ...baseCar, angle: ANGLE.south, id: 1, x: 10, y: 40 };
      const carAhead: Car = { ...baseCar, angle: ANGLE.south, id: 2, x: 11, y: 20 };

      // gap = car.y - potentialCar.y - car.length => 40 - 20 - 8 = 12
      const result = findCarAhead([carAhead], car);
      expect(result).toEqual({ car: carAhead, gap: 12 });
    });

    it("ignores cars outside lateral lane tolerance on avenues", () => {
      const car: Car = { ...baseCar, angle: ANGLE.north, id: 1, x: 10, y: 10 };
      const carAhead: Car = { ...baseCar, angle: ANGLE.north, id: 2, x: 20, y: 30 }; // delta x = 10 (>= 5)

      const result = findCarAhead([carAhead], car);
      expect(result).toBeUndefined();
    });
  });

  describe("Street traffic (East / West)", () => {
    it("finds a car ahead moving East", () => {
      const car: Car = { ...baseCar, angle: ANGLE.east, id: 1, x: 10, y: 10 };
      const carAhead: Car = { ...baseCar, angle: ANGLE.east, id: 2, x: 30, y: 11 }; // delta y = 1 (< 5)

      // potentialCar.x (30) < car.x (10) check passes. gap = 30 - 10 = 20. Math.abs(20) - 8 = 12
      const result = findCarAhead([carAhead], car);
      expect(result).toEqual({ car: carAhead, gap: 12 });
    });

    it("skips East bound cars positioned behind the current car", () => {
      const car: Car = { ...baseCar, angle: ANGLE.east, id: 1, x: 30, y: 10 };
      const carBehind: Car = { ...baseCar, angle: ANGLE.east, id: 2, x: 10, y: 10 }; // potentialCar.x < car.x

      const result = findCarAhead([carBehind], car);
      expect(result).toBeUndefined();
    });

    it("finds a car ahead moving West", () => {
      const car: Car = { ...baseCar, angle: ANGLE.west, id: 1, x: 50, y: 10 };
      const carAhead: Car = { ...baseCar, angle: ANGLE.west, id: 2, x: 20, y: 10 };

      // potentialCar.x > car.x check skips cars ahead in positive x direction for West-bound cars
      // gap calculation for west: potentialCar.x - car.x = 20 - 50 = -30 -> Math.abs(-30) - 8 = 22
      const result = findCarAhead([carAhead], car);
      expect(result).toEqual({ car: carAhead, gap: 22 });
    });

    it("skips West bound cars positioned ahead in positive x direction", () => {
      const car: Car = { ...baseCar, angle: ANGLE.west, id: 1, x: 20, y: 10 };
      const carBehind: Car = { ...baseCar, angle: ANGLE.west, id: 2, x: 50, y: 10 }; // potentialCar.x > car.x

      const result = findCarAhead([carBehind], car);
      expect(result).toBeUndefined();
    });

    it("ignores cars outside lateral lane tolerance on streets", () => {
      const car: Car = { ...baseCar, angle: ANGLE.east, id: 1, x: 10, y: 10 };
      const carAhead: Car = { ...baseCar, angle: ANGLE.east, id: 2, x: 30, y: 20 }; // delta y = 10 (>= 5)

      const result = findCarAhead([carAhead], car);
      expect(result).toBeUndefined();
    });
  });

  describe("Gap threshold and selection logic", () => {
    it("ignores cars with gaps less than -2", () => {
      const car: Car = { ...baseCar, angle: ANGLE.east, id: 1, length: 20, x: 10, y: 10 };
      const carAhead: Car = { ...baseCar, angle: ANGLE.east, id: 2, length: 5, x: 15, y: 10 };
      // gap = 15 - 10 - 20 = -15 (< -2)

      const result = findCarAhead([carAhead], car);
      expect(result).toBeUndefined();
    });

    it("selects the closest car when multiple cars are ahead", () => {
      const car: Car = { ...baseCar, angle: ANGLE.east, id: 1, x: 10, y: 10 };
      const farCar: Car = { ...baseCar, angle: ANGLE.east, id: 2, x: 50, y: 10 };
      const closeCar: Car = { ...baseCar, angle: ANGLE.east, id: 3, x: 25, y: 10 };

      const result = findCarAhead([farCar, closeCar], car);
      expect(result?.car.id).toBe(3);
    });

    it("selects the closest car when multiple cars are ahead, and one car is close but on an avenue", () => {
      const car: Car = { ...baseCar, angle: ANGLE.east, id: 1, x: 10, y: 10 };
      const farCar: Car = { ...baseCar, angle: ANGLE.east, id: 2, x: 50, y: 10 };
      const closeCar: Car = { ...baseCar, angle: ANGLE.east, id: 3, x: 25, y: 10 };
      const avenueCar: Car = { ...baseCar, angle: ANGLE.north, id: 4, x: 10, y: 12 };

      const result = findCarAhead([farCar, closeCar, avenueCar], car);
      expect(result?.car.id).toBe(3);
    });    
  });
});
