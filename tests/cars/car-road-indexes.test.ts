import type { MapConfig } from "../../src/config";
import type { State } from "../../src/state";

import { describe, expect, it } from "vitest";

import { updateCarRoadIndexes } from "../../src/cars/car-road-indexes";
import { ANGLE } from "../../src/cars/spawn";

describe("updateCarRoadIndexes", () => {
  const mockMapConfig: MapConfig = {
    avenueWidth: 20,
    halfAve: 10,
    halfSt: 10,
    streetWidth: 20,
  } as MapConfig;

  it("should throw an error when no avenue exists", () => {
    const state: State = {
      avenuesX: [],
      cars: [{ angle: ANGLE.east, avenueIndex: 0, streetIndex: 0, x: 101, y: 100 }],
      streetsY: [100, 200, 300],
    } as unknown as State;

    expect(() => {
      updateCarRoadIndexes(state, mockMapConfig);
    }).toThrow("Invalid Avenue Index: 0");
  });

  it("should throw an error when no street exists", () => {
    const state: State = {
      avenuesX: [100, 200, 300],
      cars: [{ angle: ANGLE.east, avenueIndex: 0, streetIndex: 0, x: 101, y: 100 }],
      streetsY: [],
    } as unknown as State;

    expect(() => {
      updateCarRoadIndexes(state, mockMapConfig);
    }).toThrow("Invalid Street Index: 0");
  });

  it("should throw an error when no street exists", () => {
    const state: State = {
      avenuesX: [100, 200, 300],
      cars: [{ angle: 999, avenueIndex: 0, streetIndex: 0, x: 101, y: 100 }],
      streetsY: [100, 200, 300],
    } as unknown as State;

    expect(() => {
      updateCarRoadIndexes(state, mockMapConfig);
    }).toThrow("Invalid Car Angle: 999");
  });


  it("should increment avenueIndex when a car moving East passes the next intersection", () => {
    const state: State = {
      avenuesX: [100, 200, 300],
      cars: [{ angle: ANGLE.east, avenueIndex: 0, streetIndex: 0, x: 101, y: 100 }],
      streetsY: [100, 200, 300],
    } as unknown as State;

    updateCarRoadIndexes(state, mockMapConfig);

    const car = state.cars[0]!;
    expect(car.avenueIndex).toBe(1);
    expect(car.streetIndex).toBe(0);
  });

  it("should NOT increment avenueIndex when a car moving East has not reached the threshold", () => {
    const state: State = {
      avenuesX: [100, 200, 300],
      cars: [{ angle: ANGLE.east, avenueIndex: 0, streetIndex: 0, x: 80, y: 100 }],
      streetsY: [100, 200, 300],
    } as unknown as State;

    updateCarRoadIndexes(state, mockMapConfig);

    expect(state.cars[0]!.avenueIndex).toBe(0);
  });

  it("should decrement avenueIndex when a car moving West passes the previous intersection", () => {
    const state: State = {
      avenuesX: [100, 200, 300],
      cars: [{ angle: ANGLE.west, avenueIndex: 1, streetIndex: 0, x: 180, y: 100 }],
      streetsY: [100, 200, 300],
    } as unknown as State;

    updateCarRoadIndexes(state, mockMapConfig);

    const car = state.cars[0]!;

    expect(car.avenueIndex).toBe(0);
    expect(car.streetIndex).toBe(0);
  });

    it("should not decrement avenueIndex when a car moving West does not pass through the intersection", () => {
    const state: State = {
      avenuesX: [100, 200, 300],
      cars: [{ angle: ANGLE.west, avenueIndex: 1, streetIndex: 0, x: 210, y: 100 }],
      streetsY: [100, 200, 300],
    } as unknown as State;

    updateCarRoadIndexes(state, mockMapConfig);

    const car = state.cars[0]!;

    expect(car.avenueIndex).toBe(1);
    expect(car.streetIndex).toBe(0);
  });

  it("should increment streetIndex when a car moving North passes the next intersection", () => {
    const state: State = {
      avenuesX: [100, 200, 300],
      cars: [{ angle: ANGLE.north, avenueIndex: 0, streetIndex: 0, x: 100, y: 91 }],
      streetsY: [100, 200, 300],
    } as unknown as State;

    updateCarRoadIndexes(state, mockMapConfig);

    const car = state.cars[0]!;

    expect(car.streetIndex).toBe(1);
    expect(car.avenueIndex).toBe(0);
  });

  it("should decrement streetIndex when a car moving South passes the next intersection", () => {
    const state: State = {
      avenuesX: [100, 200, 300],
      cars: [{ angle: ANGLE.south, avenueIndex: 0, streetIndex: 2, x: 100, y: 190 }],
      streetsY: [100, 200, 300],
    } as unknown as State;

    updateCarRoadIndexes(state, mockMapConfig);

    const car = state.cars[0]!;

    expect(car.streetIndex).toBe(1);
    expect(car.avenueIndex).toBe(0);
  });

it("should not decrement streetIndex when a car moving South passes the next intersection", () => {
    const state: State = {
      avenuesX: [100, 200, 300],
      cars: [{ angle: ANGLE.south, avenueIndex: 0, streetIndex: 1, x: 100, y: 210 }],
      streetsY: [100, 200, 300],
    } as unknown as State;

    updateCarRoadIndexes(state, mockMapConfig);

    const car = state.cars[0]!;

    expect(car.streetIndex).toBe(1);
    expect(car.avenueIndex).toBe(0);
  });  

  it("should not increment avenueIndex when a car moving east has moved through the last intersection", () => {
    const state: State = {
      avenuesX: [100, 200, 300],
      cars: [{ angle: ANGLE.east, avenueIndex: 2, streetIndex: 0, x: 310, y: 100 }],
      streetsY: [100, 200, 300],
    } as unknown as State;

    updateCarRoadIndexes(state, mockMapConfig);

    const car = state.cars[0]!;
    expect(car.avenueIndex).toBe(2);
    expect(car.streetIndex).toBe(0);
  });

  it("should not decrement avenueIndex when a car moving west has moved through the last intersection", () => {
    const state: State = {
      avenuesX: [100, 200, 300],
      cars: [{ angle: ANGLE.west, avenueIndex: 0, streetIndex: 0, x: 90, y: 100 }],
      streetsY: [100, 200, 300],
    } as unknown as State;

    updateCarRoadIndexes(state, mockMapConfig);

    const car = state.cars[0]!;
    expect(car.avenueIndex).toBe(0);
    expect(car.streetIndex).toBe(0);
  });

  it("should not increment streetIndex when a car moving south has moved through the last intersection", () => {
    const state: State = {
      avenuesX: [100, 200, 300],
      cars: [{ angle: ANGLE.north, avenueIndex: 0, streetIndex: 2, x: 100, y: 290 }],
      streetsY: [100, 200, 300],
    } as unknown as State;

    updateCarRoadIndexes(state, mockMapConfig);

    const car = state.cars[0]!;
    expect(car.avenueIndex).toBe(0);
    expect(car.streetIndex).toBe(2);
  });

  it("should not decrement streetIndex when a car moving south has moved through the last intersection", () => {
    const state: State = {
      avenuesX: [100, 200, 300],
      cars: [{ angle: ANGLE.south, avenueIndex: 0, streetIndex: 0, x: 100, y: 90 }],
      streetsY: [100, 200, 300],
    } as unknown as State;

    updateCarRoadIndexes(state, mockMapConfig);

    const car = state.cars[0]!;
    expect(car.avenueIndex).toBe(0);
    expect(car.streetIndex).toBe(0);
  });
});
