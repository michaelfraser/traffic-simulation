import type { MapConfig } from "../config";
import type { MapState, State } from "../state";

import { renderCars } from "./cars";
import { renderGrid } from "./grid";
import { renderTrafficLightBulbs } from "./traffic-light-bulbs";
import { renderTrafficLights } from "./traffic-lights";

let cacheMapCanvas: CanvasImageSource | null = null;

export function cacheStaticMap(state: State, mapState: MapState, mapConfig: MapConfig): void {
  cacheMapCanvas = document.createElement("canvas");
  cacheMapCanvas.width = mapState.canvas.width;
  cacheMapCanvas.height = mapState.canvas.height;

  const staticCtx = cacheMapCanvas.getContext("2d");
  const originalCtx = mapState.ctx;

  if (staticCtx) {
    mapState.ctx = staticCtx;
  }

  renderGrid(state, mapState, mapConfig);
  renderTrafficLights(state, mapState, mapConfig);

  mapState.ctx = originalCtx;
}

export function renderFrame(state: State, mapState: MapState, mapConfig: MapConfig): void {
  const ctx = mapState.ctx;

  ctx.clearRect(0, 0, mapState.canvas.width, mapState.canvas.height);
  ctx.save();
  ctx.translate(0, mapState.canvas.height);

  const zoom = mapState.scale || 1; // Make sure scale isn't undefined or 0
  ctx.scale(zoom, -zoom);
  ctx.translate(mapState.panX, mapState.panY);

  if (!cacheMapCanvas) {
    cacheStaticMap(state, mapState, mapConfig);
  } else {
    ctx.drawImage(cacheMapCanvas, 0, 0);
  }

  renderTrafficLightBulbs(state, mapState, mapConfig);
  renderCars(state, mapState);

  // renderIntersectionCrossHair(state, mapState, mapConfig)

  ctx.restore();
}
