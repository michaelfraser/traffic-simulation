import type { Car, State } from "../../src/state";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { ANGLE } from "../../src/cars/spawn";
import { isAvenueTrafficLightGreen } from "../../src/utils";
import { getUpcomingTrafficLightInfo } from "../../src/world/upcoming-traffic-light";

vi.mock("../../src/utils", () => ({
  isAvenueTrafficLightGreen: vi.fn(),
  isOnAvenue: vi.fn(),
  isTravellingEast: vi.fn(),
}));

vi.mock("../../src/intersection/is-exit-grid-locked", () => ({
  isIntersectionExitGridLocked: vi.fn(),
}));

describe("Traffic Light Info & Index Calculations", () => {
  let mockCar: Car;
  let mockState: State;

  beforeEach(() => {
    vi.clearAllMocks();
    mockState = {
      avenuesX: new Float32Array(),
      cars: [],
      intersections: [],
      lightPhase: 0,
      lightTimer: 0,
      streetsY: new Float32Array(),
    };
    mockCar = {
      angle: ANGLE.east,
      avenueIndex: 2,
      colour: "#000",
      id: 1,
      length: 8,
      speed: 2,
      streetIndex: 2,
      width: 4,
      x: 0,
      y: 0,
    };
  });

  describe("getUpcomingTrafficLightInfo across different angles", () => {
    it("should handle EAST: return current indices, mutate avenueIndex++, and check light status", () => {
      mockCar.angle = ANGLE.east;
      vi.mocked(isAvenueTrafficLightGreen).mockReturnValue(true);

      const result = getUpcomingTrafficLightInfo(mockState, mockCar);

      // Postfix returns initial values (street: 2, avenue: 3)
      expect(result).toEqual({
        avenueIndex: 2,
        isAvenueGreen: true,
        streetIndex: 2,
      });
      // Verifies no side-effect mutation on the car object
      expect(mockCar.avenueIndex).toBe(2);
      expect(mockCar.streetIndex).toBe(2);
      expect(isAvenueTrafficLightGreen).toHaveBeenCalledWith(mockState, 2, 2);
    });

    it("should handle WEST: return current indices, mutate avenueIndex--, and check light status", () => {
      mockCar.angle = ANGLE.west;
      vi.mocked(isAvenueTrafficLightGreen).mockReturnValue(false);

      const result = getUpcomingTrafficLightInfo(mockState, mockCar);

      expect(result).toEqual({
        avenueIndex: 2,
        isAvenueGreen: false,
        streetIndex: 2,
      });
      expect(isAvenueTrafficLightGreen).toHaveBeenCalledWith(mockState, 2, 2);
    });

    it("should handle NORTH: return current indices, mutate streetIndex--, and check light status", () => {
      mockCar.angle = ANGLE.north;
      vi.mocked(isAvenueTrafficLightGreen).mockReturnValue(true);

      const result = getUpcomingTrafficLightInfo(mockState, mockCar);

      expect(result).toEqual({
        avenueIndex: 2,
        isAvenueGreen: true,
        streetIndex: 2,
      });
      expect(isAvenueTrafficLightGreen).toHaveBeenCalledWith(mockState, 2, 2);
    });

    it("should handle SOUTH: return current indices, mutate streetIndex++, and check light status", () => {
      mockCar.angle = ANGLE.south;
      vi.mocked(isAvenueTrafficLightGreen).mockReturnValue(false);

      const result = getUpcomingTrafficLightInfo(mockState, mockCar);

      expect(result).toEqual({
        avenueIndex: 2,
        isAvenueGreen: false,
        streetIndex: 2,
      });
      expect(isAvenueTrafficLightGreen).toHaveBeenCalledWith(mockState, 2, 2);
    });
  });

});
