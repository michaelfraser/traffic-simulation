import type { Car } from "../../src/state";

import { beforeEach, describe, expect, it } from "vitest";

import { ANGLE } from "../../src/cars/spawn";
import { applyStopLineConstraint } from "../../src/intersection/stop-line-constraint"; // Adjust import path

describe("applyStopLineConstraint", () => {
  let mockCar: Car;

  beforeEach(() => {
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

  describe("Street Constraints (isAvenue = false)", () => {
    it("maintains current speed when far away from the stop line (dist >= 50)", () => {
      mockCar.x = 0;
      mockCar.speed = 4;
      const stopLinePos = 100; 
      const speed = applyStopLineConstraint(mockCar, false, stopLinePos);
      
      expect(speed).toBe(4);
      expect(mockCar.x).toBe(0); // Position should remain unchanged
    });

    it("reduces speed proportionally when approaching the stop line (2 < dist < 50)", () => {
      mockCar.x = 30;
      mockCar.speed = 5;
      const stopLinePos = 50;
      const speed = applyStopLineConstraint(mockCar, false, stopLinePos);
      
      expect(speed).toBe(1.6);
    });

    it("caps speed to currentSpeed if distance calculation exceeds it", () => {
      mockCar.x = 30;
      mockCar.speed = 0.5;
      const stopLinePos = 50;
      const speed = applyStopLineConstraint(mockCar, false, stopLinePos);
      
      expect(speed).toBe(0.5);
    });

    it("stops completely and snaps position to the stop line when dist <= 2 (East bound)", () => {
      mockCar.angle = ANGLE.east;
      mockCar.x = 45;
      mockCar.speed = 2;
      const stopLinePos = 50;
      const speed = applyStopLineConstraint(mockCar, false, stopLinePos);
      
      expect(speed).toBe(0);
      expect(mockCar.x).toBe(46);
    });

    it("west travelling cars stops completely and snaps position to the stop line when dist <= 2 (East bound)", () => {
      mockCar.angle = ANGLE.west;
      mockCar.x = 72;
      mockCar.speed = 2;
      const stopLinePos = 70;
      const speed = applyStopLineConstraint(mockCar, false, stopLinePos);
      
      expect(speed).toBe(0);
      expect(mockCar.x).toBe(74);
    });    
  });

  describe("Avenue Constraints (isAvenue = true)", () => {
    it("stops and snaps y position correctly for north-facing cars", () => {
      mockCar.angle = ANGLE.north;
      mockCar.y = 45;
      mockCar.speed = 2;
      const stopLinePos = 50;
      const speed = applyStopLineConstraint(mockCar, true, stopLinePos);
      
      expect(speed).toBe(0);
      expect(mockCar.y).toBe(46);
    });

    it("maintains current speed when far away from the stop line (dist >= 50)", () => {

      mockCar.angle = ANGLE.south;
      mockCar.y = 120;
      mockCar.speed = 2;
      const stopLinePos = 50;
      const speed = applyStopLineConstraint(mockCar, true, stopLinePos);
      
      expect(speed).toBe(2);
      expect(mockCar.y).toBe(120);
    });


    it("stops and snaps y position correctly for south-facing cars", () => {
      mockCar.angle = ANGLE.south;
      mockCar.y = 55;
      mockCar.speed = 2;
      const stopLinePos = 50;
      const speed = applyStopLineConstraint(mockCar, true, stopLinePos);
      
      expect(speed).toBe(0);
      expect(mockCar.y).toBe(54);
    });
  });
});