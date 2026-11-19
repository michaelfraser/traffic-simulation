import type { MapConfig } from "../../src/config";
import type { Car, State } from "../../src/state";
import type { UpcomingTrafficLight } from "../../src/world/upcoming-traffic-light";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { ANGLE } from "../../src/cars/spawn";
import { calculateSpeedAtTrafficLight } from "../../src/intersection/calculate-speed-at-traffic-light";
import { isIntersectionExitGridLocked } from "../../src/intersection/is-exit-grid-locked";
import { applyStopLineConstraint } from "../../src/intersection/stop-line-constraint";
import { isOnAvenue, isTravellingEast } from "../../src/utils";
import { getUpcomingTrafficLightInfo } from "../../src/world/upcoming-traffic-light";

vi.mock("../../src/utils", () => ({
  isOnAvenue: vi.fn(),
  isTravellingEast: vi.fn(),
}));

vi.mock("../../src/intersection/is-exit-grid-locked", () => ({
  isIntersectionExitGridLocked: vi.fn(),
}));

vi.mock("../../src/intersection/stop-line-constraint", () => ({
  applyStopLineConstraint: vi.fn(),
}));

vi.mock("../../src/world/upcoming-traffic-light", () => ({
  getUpcomingTrafficLightInfo: vi.fn(),
}));

describe("calculateTrafficLightSpeed", () => {
  let mockCar: Car;
  let mockState: State;
  let mockMapConfig: MapConfig;
  let mockUpcomingTrafficLight: UpcomingTrafficLight;

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
    mockMapConfig = {
      avenueWidth: 20,
      cols: 3,
      halfAve: 10,
      halfSt: 10,
      padding: 30,
      rows: 3,
      streetWidth: 20,
      worldHeight: 1000,
      worldWidth: 1000,
    } as MapConfig;
    mockUpcomingTrafficLight = {
      avenueIndex: 1,
      isAvenueGreen: true,
      streetIndex: 1,
    };
  });

  describe("Avenue NORTH calculateTrafficLightSpeed", () => {
    beforeEach(() => {
      vi.mocked(isOnAvenue).mockReturnValue(true);
      mockCar.angle = ANGLE.north;
      mockState.avenuesX = new Float32Array([100, 200, 300]);
      mockState.streetsY = new Float32Array([100, 200, 300]);
    });

    it("should not handle travelling north with a red light that has invalid streets", () => {
      mockState.streetsY = new Float32Array([]);
      mockUpcomingTrafficLight.isAvenueGreen = false;
      vi.mocked(getUpcomingTrafficLightInfo).mockReturnValue(mockUpcomingTrafficLight);

      expect(() => {
        calculateSpeedAtTrafficLight(mockState, mockMapConfig, mockCar);
      }).toThrow("Invalid value");
    });

    it("should handle travelling north with a green light and the intersection is not grid locked", () => {
      vi.mocked(getUpcomingTrafficLightInfo).mockReturnValue(mockUpcomingTrafficLight);
      vi.mocked(isIntersectionExitGridLocked).mockReturnValue(false);

      const result = calculateSpeedAtTrafficLight(mockState, mockMapConfig, mockCar);

      expect(result).toBe(2);
    });

    it("should handle travelling north with a green light and the intersection is grid locked", () => {
      vi.mocked(getUpcomingTrafficLightInfo).mockReturnValue(mockUpcomingTrafficLight);
      vi.mocked(isIntersectionExitGridLocked).mockReturnValue(true);

      const result = calculateSpeedAtTrafficLight(mockState, mockMapConfig, mockCar);

      expect(result).toBe(0);
    });

    it("should handle travelling north with red light", () => {
      mockUpcomingTrafficLight.isAvenueGreen = false;
      vi.mocked(getUpcomingTrafficLightInfo).mockReturnValue(mockUpcomingTrafficLight);
      vi.mocked(applyStopLineConstraint).mockReturnValue(1.1);

      const result = calculateSpeedAtTrafficLight(mockState, mockMapConfig, mockCar);

      expect(result).toBe(1.1);
    });
  });

  describe("Street calculateTrafficLightSpeed", () => {
    beforeEach(() => {
      mockUpcomingTrafficLight.isAvenueGreen = false;
      vi.mocked(isOnAvenue).mockReturnValue(false);
      mockState.avenuesX = new Float32Array([100, 200, 300]);
      mockState.streetsY = new Float32Array([100, 200, 300]);
    });

    it("should handle travelling east on a street, with a green light, with the intersection not being grid locked", () => {
      vi.mocked(isTravellingEast).mockReturnValue(true);
      vi.mocked(getUpcomingTrafficLightInfo).mockReturnValue(mockUpcomingTrafficLight);
      vi.mocked(isIntersectionExitGridLocked).mockReturnValue(false);

      const result = calculateSpeedAtTrafficLight(mockState, mockMapConfig, mockCar);

      expect(result).toBe(2);
    });

    it("should handle travelling east on a street, with a green light, with the intersection being grid locked", () => {
      vi.mocked(isTravellingEast).mockReturnValue(true);
      vi.mocked(getUpcomingTrafficLightInfo).mockReturnValue(mockUpcomingTrafficLight);
      vi.mocked(isIntersectionExitGridLocked).mockReturnValue(true);

      const result = calculateSpeedAtTrafficLight(mockState, mockMapConfig, mockCar);

      expect(result).toBe(0);
    });

    it("should handle travelling west on a street, with a red light", () => {
      mockUpcomingTrafficLight.isAvenueGreen = true;
      mockCar.angle = ANGLE.west;
      vi.mocked(isTravellingEast).mockReturnValue(false);
      vi.mocked(getUpcomingTrafficLightInfo).mockReturnValue(mockUpcomingTrafficLight);
      vi.mocked(applyStopLineConstraint).mockReturnValue(1.1);

      const result = calculateSpeedAtTrafficLight(mockState, mockMapConfig, mockCar);

      expect(result).toBe(1.1);
    });
  });
});
