import type { MapState, State } from "../state";

import { COLOURS } from "../config";

export function renderCars(state: State, mapState: MapState): void {
  const ctx = mapState.ctx;
  const cars = state.cars;

  // Convert physical screen dimensions into world coordinates based on zoom scale
  const worldViewportWidth = mapState.canvas.width / mapState.scale;
  const worldViewportHeight = mapState.canvas.height / mapState.scale;

  const viewMinX = -mapState.panX;
  const viewMaxX = -mapState.panX + worldViewportWidth;
  const viewMinY = -mapState.panY;
  const viewMaxY = -mapState.panY + worldViewportHeight;

  // Add a buffer (in world units) so cars don't pop in abruptly at the screen edge
  const buffer = 100;

  for (const car of cars) {
    // Skip rendering cars that are completely outside the current camera view
    if (
      car.x < viewMinX - buffer ||
      car.x > viewMaxX + buffer ||
      car.y < viewMinY - buffer ||
      car.y > viewMaxY + buffer
    ) {
      continue;
    }

    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate((car.angle * Math.PI) / 180);

    const halfL = car.length / 2;
    const halfW = car.width / 2;

    // Vehicle Body
    ctx.fillStyle = car.colour;
    ctx.beginPath();
    ctx.roundRect(-halfL, -halfW, car.length, car.width, 1.5);
    ctx.fill();

    // Headlights
    ctx.fillStyle = COLOURS.headlights;
    ctx.fillRect(halfL - 1, -halfW + 0.5, 1, 1);
    ctx.fillRect(halfL - 1, halfW - 1.5, 1, 1);

    // Taillights
    ctx.fillStyle = COLOURS.taillights;
    ctx.fillRect(-halfL, -halfW + 0.5, 1, 1);
    ctx.fillRect(-halfL, halfW - 1.5, 1, 1);

    ctx.restore();
  }
}
