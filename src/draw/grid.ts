import type { MapConfig } from "../config.js";
import type { MapState, State } from "../state.js";

import { COLOURS, mapConfig } from "../config.js";

export function renderGrid(state: State, mapState: MapState, mapConfig: MapConfig): void {
  drawCityBackground(mapState);
  drawRoadAsphalt(state, mapState, mapConfig);
  drawStreetMarkings(state, mapState);
  drawAvenueMarkings(state, mapState);
  drawIntersectionsAndCrosswalks(state, mapState, mapConfig);
  drawLabels(state, mapState, mapConfig);
}

function drawAvenueMarkings(state: State, mapState: MapState): void {
  const ctx = mapState.ctx;

  ctx.strokeStyle = COLOURS.dashLines;
  ctx.lineWidth = 2 / mapState.scale;
  ctx.setLineDash([]);

  ctx.beginPath();
  state.avenuesX.forEach((x) => {
    ctx.moveTo(x - 2, -5000);
    ctx.lineTo(x - 2, 5000);
    ctx.moveTo(x + 2, -5000);
    ctx.lineTo(x + 2, 5000);
  });
  ctx.stroke();

  ctx.strokeStyle = COLOURS.laneLines;
  ctx.lineWidth = 1 / mapState.scale;
  ctx.setLineDash([8 / mapState.scale, 8 / mapState.scale]);

  const quarterWidth = mapConfig.avenueWidth / 4;

  ctx.beginPath();
  state.avenuesX.forEach((x) => {
    ctx.moveTo(x - quarterWidth, -5000);
    ctx.lineTo(x - quarterWidth, 5000);
    ctx.moveTo(x + quarterWidth, -5000);
    ctx.lineTo(x + quarterWidth, 5000);
  });
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawCityBackground(mapState: MapState): void {
  const ctx = mapState.ctx;
  ctx.fillStyle = COLOURS.background;
  ctx.fillRect(-10000, -10000, 20000, 20000);
}

function drawIntersectionsAndCrosswalks(
  state: State,
  mapState: MapState,
  mapConfig: MapConfig
): void {
  const ctx = mapState.ctx;
  const halfSt = mapConfig.streetWidth / 2;
  const halfAve = mapConfig.avenueWidth / 2;
  const streetsY = state.streetsY;
  const avenuesX = state.avenuesX;

  const avenueWidth = mapConfig.avenueWidth;
  const streetWidth = mapConfig.streetWidth;

  ctx.fillStyle = COLOURS.asphalt;
  for (const x of avenuesX) {
    for (const y of streetsY) {
      ctx.fillRect(x - halfAve, y - halfSt, avenueWidth, streetWidth);
    }
  }

  ctx.strokeStyle = COLOURS.whiteLines;
  ctx.lineWidth = 2.5 / mapState.scale;
  ctx.beginPath();

  for (const y of streetsY) {
    const yBottom = y - halfSt; // Lower edge
    const yTop = y + halfSt; // Higher edge (Top)

    for (const x of avenuesX) {
      const xLeft = x - halfAve;
      const xRight = x + halfAve;

      // Top line
      ctx.moveTo(xLeft, yTop);
      ctx.lineTo(xRight, yTop);

      // Bottom line
      ctx.moveTo(xLeft, yBottom);
      ctx.lineTo(xRight, yBottom);

      // Right line
      ctx.moveTo(xRight, yBottom);
      ctx.lineTo(xRight, yTop);

      // Left line
      ctx.moveTo(xLeft, yBottom);
      ctx.lineTo(xLeft, yTop);
    }
  }

  // Render everything in one single batch operation
  ctx.stroke();
}

function drawLabels(state: State, mapState: MapState, mapConfig: MapConfig): void {
  const ctx = mapState.ctx;

  ctx.fillStyle = COLOURS.text;
  ctx.font = Math.max(10, 12 / mapState.scale).toString() + "px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  state.avenuesX.forEach((x, index) => {
    const textX = x + 44;
    const textY = mapConfig.worldHeight - 35;

    ctx.save();
    // 1. Move origin to where the text should be drawn
    ctx.translate(textX, textY);

    // 2. Counter-flip the Y-axis (-1 * -1 = right side up!)
    ctx.scale(1, -1);

    // 3. Draw text at local (0,0)
    ctx.fillText(getRoadNameWithSuffix(index + 1) + " Ave", 0, 0);

    ctx.restore();
  });

  ctx.textAlign = "left";

  state.streetsY.forEach((y, index) => {
    const textX = 0;
    const textY = y + 22;

    ctx.save();
    // 1. Move origin to where the text should be drawn
    ctx.translate(textX, textY);

    // 2. Counter-flip the Y-axis (-1 * -1 = right side up!)
    ctx.scale(1, -1);

    // 3. Draw text at local (0,0)
    ctx.fillText(getRoadNameWithSuffix(index + 1) + " St", 0, 0);

    ctx.restore();
  });
}

function drawRoadAsphalt(state: State, mapState: MapState, mapConfig: MapConfig): void {
  const ctx = mapState.ctx;
  const streetsY = state.streetsY;
  const avenuesX = state.avenuesX;
  const halfSt = mapConfig.halfSt;
  const halfAve = mapConfig.halfAve;
  const streetWidth = mapConfig.streetWidth;
  const avenueWidth = mapConfig.avenueWidth;

  ctx.fillStyle = COLOURS.asphalt;
  ctx.beginPath();

  // Accumulate all streets
  for (const y of streetsY) {
    ctx.rect(-5000, y - halfSt, 10000, streetWidth);
  }

  // Accumulate all avenues
  for (const x of avenuesX) {
    ctx.rect(x - halfAve, -5000, avenueWidth, 10000);
  }

  // Draw all roads in a single batch operation
  ctx.fill();
}

function drawStreetMarkings(state: State, mapState: MapState): void {
  const ctx = mapState.ctx;

  ctx.strokeStyle = COLOURS.laneLines;
  ctx.lineWidth = 1.5 / mapState.scale;
  ctx.setLineDash([6 / mapState.scale, 6 / mapState.scale]);

  ctx.beginPath();

  state.streetsY.forEach((y) => {
    ctx.moveTo(-5000, y);
    ctx.lineTo(5000, y);
  });

  ctx.stroke();
}

function getRoadNameWithSuffix(road: number): string {
  // Handle special cases for 11th, 12th, and 13th
  const roadString = road.toString();
  if (road > 3 && road < 21) return roadString + "th";

  // Handle standard endings based on the last digit
  switch (road % 10) {
    case 1:
      return roadString + "st";
    case 2:
      return roadString + "nd";
    case 3:
      return roadString + "rd";
    default:
      return roadString + "th";
  }
}
