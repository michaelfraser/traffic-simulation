import type { Car, State } from "../../src/state";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { ANGLE } from "../../src/cars/spawn";
import { isIntersectionExitGridLocked } from "../../src/intersection/is-exit-grid-locked";

describe("isIntersectionExitGridLocked", () => {
  let mockState: State;
  let mockCar: Car;

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
      angle: ANGLE.east, // 0 degrees -> targetX = 50, targetY = 0
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

  it("should return false when there are no other cars with State", () => {
    mockState.cars = [mockCar];

    const isLocked = isIntersectionExitGridLocked(mockState, mockCar);
    expect(isLocked).toBe(false);
  });

  it("should return false when other cars are far away from the target exit location", () => {
    const otherCar = {
      ...mockCar,
      id: 2,
      speed: 0, // Stopped, but way out of range
      x: 500,
      y: 500,
    };
    mockState.cars = [mockCar, otherCar];

    const isLocked = isIntersectionExitGridLocked(mockState, mockCar);
    expect(isLocked).toBe(false);
  });

  it("should return false when another car is close to the target exit but moving smoothly (speed > 0.2)", () => {
    // Target position for mockCar (x: 0, y: 0, angle: 0, distance: 50) is (50, 0)
    const otherCar = {
      ...mockCar,
      id: 2,
      speed: 1.5, // Moving smoothly above threshold
      x: 52, // Within threshold squared (dx = 2 -> dx^2 = 4 < 64)
      y: 0,
    };
    mockState.cars = [mockCar, otherCar];

    const isLocked = isIntersectionExitGridLocked(mockState, mockCar);
    expect(isLocked).toBe(false);
  });

  it("should return true when another car is close to the target exit and stopped/jammed (speed <= 0.2)", () => {
    // Target position is (50, 0)
    const otherCar = {
      ...mockCar,
      id: 2,
      speed: 0.1, // Stopped/jammed
      x: 48,
      y: 2,
    };
    mockState.cars = [mockCar, otherCar];

    const isLocked = isIntersectionExitGridLocked(mockState, mockCar);
    expect(isLocked).toBe(true);
  });

  it("should skip itself when evaluating state.cars", () => {
    // Place mockCar at its own target position (50, 0) with a stopped speed
    mockCar.x = 50;
    mockCar.y = 0;
    mockCar.speed = 0;
    mockState.cars = [mockCar];

    const isLocked = isIntersectionExitGridLocked(mockState, mockCar);
    expect(isLocked).toBe(false);
  });

  // TODO Add test case which covers when there are stopped cars in the intersection
  
});
