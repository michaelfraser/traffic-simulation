import type { State } from "../../src/state";

import { describe, expect, it } from "vitest";

import { IntersectionNotFoundError } from "../../src/errors/errors";
import { isAvenueTrafficLightGreen } from "../../src/utils";

describe("isAvenueTrafficLightGreen", () => {
  const state: State = {
    avenuesX: new Float32Array(),
    cars: [],
    intersections: [],
    lightPhase: 0,
    lightTimer: 0,
    streetsY: new Float32Array(),
  };

  it("throws an error when the 1st dimension index is does not have an intersection", () => {
    expect(() => isAvenueTrafficLightGreen(state, 0, 4)).toThrow(new IntersectionNotFoundError(0,4));
  });

  it("throws an error when the 2nd dimension index is outside the intersection grid", () => {
    state.intersections = [[]];
    expect(() => isAvenueTrafficLightGreen(state, 4, 0)).toThrow(new IntersectionNotFoundError(4,0));
  });
});
