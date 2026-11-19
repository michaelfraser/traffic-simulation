import type { MapConfig } from "../config";
import type { MapState, State } from "../state";

import { COLOURS } from "../config";
import { isTravellingEast } from "../utils";

const LIGHT_WIDTH = 10;
const LIGHT_HEIGHT = 22;
const CORNER_RADIUS = 3;

export function renderTrafficLights(
  state: State,
  mapState: MapState,
  mapConfig: MapConfig,
): void {
  const { halfAve, halfSt } = mapConfig;

  state.streetsY.forEach((y, rIndex) => {
    const isEastbound = isTravellingEast(rIndex);

    state.avenuesX.forEach((x) => {

      // Southbound Avenue Approach (Approaches from the TOP edge: y + halfSt) ---
      renderTrafficLight(mapState, x - 6, y + halfSt + 2, true);

      // Northbound Avenue Approach (Approaches from the BOTTOM edge: y - halfSt) ---
      renderTrafficLight(mapState, x - 6, y - halfSt - 24, true);
      
      // Cross-Street Approach (One-Way) ---
      if (isEastbound) {
        // Eastbound: Left stop line (x - halfAve)
        renderTrafficLight(mapState, x - halfAve - 22, y - halfSt -10, false);
      } else {
        // Westbound: Right stop line (x + halfAve)
        renderTrafficLight(mapState, x + halfAve, y + halfSt, false);
      }
    });
  });
}

function renderTrafficLight(
  mapState: MapState,
  posX: number,
  posY: number,
  isAvenue: boolean,
): void {
  const ctx = mapState.ctx;
  const width = isAvenue ? LIGHT_WIDTH : LIGHT_HEIGHT;
  const height = isAvenue ? LIGHT_HEIGHT : LIGHT_WIDTH;

  ctx.save();
  ctx.translate(posX, posY);
  // Housing pill background
  ctx.fillStyle = COLOURS.lightHousing;
  ctx.strokeStyle = "#374151";
  ctx.lineWidth = 1 / mapState.scale;
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, CORNER_RADIUS);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}