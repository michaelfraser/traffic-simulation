import type { MapConfig } from "../config";
import type { MapState, State } from "../state";

import { ANGLE } from "../cars/spawn";
import { COLOURS } from "../config";
import { isOnAvenue, isTravellingEast } from "../utils";
import { isAvenueTrafficLightGreen } from "../utils";

const BULB_RADIUS = 3;

export function renderTrafficLightBulbs(
  state: State,
  mapState: MapState,
  mapConfig: MapConfig
): void {
  const { halfAve, halfSt } = mapConfig;
  const streetsY = state.streetsY;
  const avenuesX = state.avenuesX;

  for (const [avenueIndex, x] of avenuesX.entries()) {
    const xAvenue = x - 6;

    for (const [streetIndex, y] of streetsY.entries()) {
      const isAvenueGreen = isAvenueTrafficLightGreen(state, avenueIndex, streetIndex);
      // Pre-evaluate colors once per intersection
      const nsColor = isAvenueGreen ? "green" : "red";
      const ewColor = !isAvenueGreen ? "green" : "red";

      const isEastbound = isTravellingEast(streetIndex);

      const yAvenueLower = y - halfSt - 24;
      const yAvenueUpper = y + halfSt + 2;

      // Northbound Avenue Approach ---
      renderTrafficLight(mapState, xAvenue, yAvenueLower, nsColor, ANGLE.north);

      // Southbound Avenue Approach
      renderTrafficLight(mapState, xAvenue, yAvenueUpper, nsColor, ANGLE.south);

      if (isEastbound) {
        // Eastbound Street Approach
        renderTrafficLight(mapState, x - halfAve - 22, y - halfSt - 10, ewColor, ANGLE.east);
      } else {
        // Westbound Street Approach
        renderTrafficLight(mapState, x + halfAve, y + halfSt, ewColor, ANGLE.west);
      }
    }
  }
}
function greenColour(activeColour: string): string {
  return activeColour === "green" ? COLOURS.lightGreen : COLOURS.lightGreenInactive;
}
function redColour(activeColour: string): string {
  return activeColour === "red" ? COLOURS.lightRed : COLOURS.lightRedInactive;
}

function renderTrafficLight(
  mapState: MapState,
  posX: number,
  posY: number,
  activeColour: string,
  angle: number
): void {
  const ctx = mapState.ctx;
  ctx.save();
  ctx.translate(posX, posY);

  const isAvenue = isOnAvenue(angle);
  const isInverted = angle === ANGLE.south || angle === ANGLE.west;

  // South and West invert which bulb color goes first
  const primaryColor = isInverted ? redColour(activeColour) : greenColour(activeColour);
  const secondaryColor = isInverted ? greenColour(activeColour) : redColour(activeColour);

  if (isAvenue) {
    renderTrafficLightBulb(mapState, 5, 6, primaryColor);
    renderTrafficLightBulb(mapState, 5, 16, secondaryColor);
  } else {
    renderTrafficLightBulb(mapState, 6, 6, primaryColor);
    renderTrafficLightBulb(mapState, 16, 6, secondaryColor);
  }

  ctx.restore();
}

function renderTrafficLightBulb(mapState: MapState, x: number, y: number, colour: string): void {
  const ctx = mapState.ctx;
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(x, y, BULB_RADIUS, 0, Math.PI * 2);
  ctx.fill();
}
