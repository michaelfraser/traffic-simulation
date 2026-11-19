import type { Car, State } from "../state";

export function isIntersectionExitGridLocked(state: State, car: Car): boolean {
  const DISTANCE_INTO_EXIT_LANE = 50; // Distance ahead into the exit lane
  const STOPPED_SPEED_THRESHOLD = 0.2;

  const rad = (car.angle * Math.PI) / 180;

  const targetX = car.x + Math.cos(rad) * DISTANCE_INTO_EXIT_LANE;
  const targetY = car.y + Math.sin(rad) * DISTANCE_INTO_EXIT_LANE;

  const thresholdSquared = car.length * car.length;

  for (const otherCar of state.cars) {
    if (otherCar === car) continue;

    const dx = otherCar.x - targetX;
    const dy = otherCar.y - targetY;
    const distanceSquared = dx * dx + dy * dy;

    if (distanceSquared < thresholdSquared) {
      // Check if the car in front is actually stopped or jammed.
      // If it's moving smoothly, we can safely ignore it and keep going!
      if (otherCar.speed <= STOPPED_SPEED_THRESHOLD) {
        // Gridlock! The exit lane is blocked by a stopped car.
        return true; 
      }
    }
  }
  return false;
}
