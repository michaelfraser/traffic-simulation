import type { Car } from "../state";

import { ANGLE } from "../cars/spawn";

export function applyStopLineConstraint(car: Car, isAvenue: boolean, stopLinePos: number): number {
  if (isAvenue) {
    return processAvenue(car, stopLinePos);
  } else {
    return processStreet(car, stopLinePos);
  }
}

function adjustSpeed(dist: number, currentSpeed: number): number {
  const closeToStopLine = dist >= -2 && dist < 50;

  if (closeToStopLine) {
    if (dist <= 2) {
      return 0;
    } else {
      return Math.min(currentSpeed, dist * 0.1);
    }
  }
  return currentSpeed;
}

// Shared core math for both axes
function calculateAxisConstraint(
  currentPos: number,
  length: number,
  speed: number,
  stopLinePos: number,
  isPositiveDirection: boolean
): { snappedPos: number; speed: number; } {
  const halfL = length / 2;
  const frontPos = currentPos + (isPositiveDirection ? halfL : -halfL);
  const dist = stopLinePos - frontPos;
  
  const currentSpeed = adjustSpeed(dist, speed);
  const snappedPos = isPositiveDirection ? stopLinePos - halfL : stopLinePos + halfL;

  return { snappedPos, speed: currentSpeed };
}

function processAvenue(car: Car, stopLinePos: number): number {
  const isNorth = car.angle === ANGLE.north;
  
  const { snappedPos, speed } = calculateAxisConstraint(
    car.y, 
    car.length, 
    car.speed, 
    stopLinePos, 
    isNorth
  );

  if (speed === 0) {
    car.y = snappedPos;
  }

  return speed;
}

function processStreet(car: Car, stopLinePos: number): number {
  const isEast = car.angle === ANGLE.east;
  
  const { snappedPos, speed,  } = calculateAxisConstraint(
    car.x, 
    car.length, 
    car.speed, 
    stopLinePos, 
    isEast
  );

  if (speed === 0) {
    car.x = snappedPos;
  }

  return speed;
}