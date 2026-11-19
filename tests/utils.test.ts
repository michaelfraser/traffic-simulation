import { describe, expect, it, vi } from "vitest";

import { getRandomAvenue, getRandomStreet } from "../src/utils";

describe("Utils", () => {
  it("should throw an error when avenue array is empty", () => {
    expect(() => {
      getRandomAvenue(new Float32Array());
    }).toThrow("Invalid Road");
  });

  it("should throw an error when street array is empty", () => {
    expect(() => {
      getRandomStreet(new Float32Array());
    }).toThrow("Invalid Road");
  });

  it("should return road info when street array is not empty", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.4);

    const randomAvenue = getRandomAvenue(new Float32Array([1, 2, 3, 4, 5]));

    expect(randomAvenue).toMatchObject({ index: 2, value: 3 });
  });

  it("should return road info when street array is not empty", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.2);

    const randomStreet = getRandomStreet(new Float32Array([1, 2, 3, 4, 5]));

    expect(randomStreet).toMatchObject({ index: 1, value: 2 });
  });
});
