import type { MapConfig } from "../config";
import type { MapState, State } from "../state";

import { renderFrame } from "../draw/draw";
import { setupGrid } from "./world";

export function resetView(state: State, mapState: MapState, mapConfig: MapConfig): void {
  resetViewState(mapState);
  renderFrame(state, mapState, mapConfig);
}

export function setupCanvas(state: State, mapState: MapState, mapConfig: MapConfig): void {
  const container = document.getElementById("canvas-container");
  if (!container) return;

  mapState.canvas.width = container.clientWidth;
  mapState.canvas.height = container.clientHeight;

  setupGrid(state, mapConfig);
}

function resetViewState(mapState: MapState): void {
  mapState.scale = 1;
  mapState.panX = 0;
  mapState.panY = 0;
}
