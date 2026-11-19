import type { Car } from "../../src/state";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { applyFollowingCarConstraint } from "../../src/cars/apply-following-car-constraint";
import { findCarAhead } from "../../src/cars/find-car-ahead";
import { ANGLE } from "../../src/cars/spawn";

vi.mock("../../src/cars/find-car-ahead", () => ({
  findCarAhead: vi.fn(),
}));

describe("applyFollowingCarConstraint", () => {
  let mockCar: Car;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCar = {
      angle: ANGLE.east,
      avenueIndex: 0,
      colour: "#000",
      id: 1,
      length: 8,
      speed: 10,
      streetIndex: 0,
      width: 4,
      x: 0,
      y: 0,
    };
  });

  it("should return current speed if no car is ahead", () => {
    vi.mocked(findCarAhead).mockReturnValue(undefined);

    const speed = applyFollowingCarConstraint([], mockCar);

    expect(speed).toBe(10);
  });

  it("should return current speed if gap is greater than 8", () => {
    vi.mocked(findCarAhead).mockReturnValue({
      car: { ...mockCar, y: 20 },
      gap: 9,
    });

    const car = { ...mockCar, speed: 15 };

    const speed = applyFollowingCarConstraint([], car);

    expect(speed).toBe(15);
  });

  it("should snap car position and return 0 speed when gap is less than or equal to targetGap", () => {
    vi.mocked(findCarAhead).mockReturnValue({
      car: { ...mockCar, y: 20 },
      gap: 2,
    });

    const car = { ...mockCar, speed: 10, y: 10 };
    const speed = applyFollowingCarConstraint([], car, 2);

    expect(speed).toBe(0);
    expect(car.y).toBe(10);
  });

  it("should snap car position when ANGLE.south", () => {
    vi.mocked(findCarAhead).mockReturnValue({
      car: { ...mockCar, angle: ANGLE.south, y: 10 },
      gap: 2,
    });

    const car = { ...mockCar, angle: ANGLE.south, y: 20 };

    const speed = applyFollowingCarConstraint([], car, 2);

    expect(speed).toBe(0);
    expect(car.y).toBe(20);
  });

  it("should snap car position when ANGLE.east", () => {
    vi.mocked(findCarAhead).mockReturnValue({
      car: { ...mockCar, x: 20 },
      gap: 2,
    });

    const car = { ...mockCar, x: 10 };

    const speed = applyFollowingCarConstraint([], car, 2);

    expect(speed).toBe(0);
    expect(car.x).toBe(10);
  });

  it("should snap car position when ANGLE.west", () => {
    vi.mocked(findCarAhead).mockReturnValue({
      car: { ...mockCar, angle: ANGLE.west, x: 10 },
      gap: 2,
    });

    const car = { ...mockCar, angle: ANGLE.west, x: 20 };

    const speed = applyFollowingCarConstraint([], car, 2);

    expect(speed).toBe(0);
    expect(car.x).toBe(20);
  });

  it("should snap car position when ANGLE.north", () => {
    vi.mocked(findCarAhead).mockReturnValue({
      car: { ...mockCar, angle: ANGLE.north, y: 20 },
      gap: 2,
    });

    const car = { ...mockCar, angle: ANGLE.north, y: 10 };

    const speed = applyFollowingCarConstraint([], car, 2);

    expect(speed).toBe(0);
    expect(car.y).toBe(10);
  });

  it("should apply smooth deceleration when gap is between targetGap and 8", () => {
    vi.mocked(findCarAhead).mockReturnValue({
      car: { ...mockCar, angle: ANGLE.north, y: 10 },
      gap: 6,
    });

    const car = { ...mockCar, angle: ANGLE.north, x: 0 };
    const speed = applyFollowingCarConstraint([], car, 2);

    expect(speed).toBe(0.6);
  });

  it("should choose constraintSpeed in Math.min if it is lower than the calculated deceleration", () => {
    vi.mocked(findCarAhead).mockReturnValue({
      car: { ...mockCar, angle: ANGLE.north, y: 10 },
      gap: 6,
    });

    const car = { ...mockCar, angle: ANGLE.north, speed: 0.2 };
    const speed = applyFollowingCarConstraint([], car, 2);

    expect(speed).toBe(0.2);
  });
});
