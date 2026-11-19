import type { MapConfig } from "./config";
import type { MapState, State } from "./state";

import { updateCarRoadIndexes } from "./cars/car-road-indexes";
import { moveCars } from "./cars/cars";
import { removeOutOfBoundsCars } from "./cars/remove-out-of-bounds-cars";
import { seedCars } from "./cars/seed";
import { spawnCars } from "./cars/spawn";
import { mapConfig } from "./config";
import { renderFrame } from "./draw/draw";
import { initialiseMapState, state } from "./state";
import { setupCanvas } from "./world/controls";
import { initListeners } from "./world/ui-events";
import { updateTrafficLights } from "./world/world";

declare global {
  interface Window {
    stopAnimation: () => void;
  }
}

// A helper function to ease debugging
window.stopAnimation = function() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    console.log("Animation stopped.");
  }
};

const MAX_FRAMES: null | number = null;

let frameCount = 0;
let animationFrameId: null | number = null;

function animate(state: State, mapState: MapState, mapConfig: MapConfig) {
  if (MAX_FRAMES && frameCount >= MAX_FRAMES) {
    console.log(`Simulation stopped after { MAX_FRAMES } frames.`);
    return;
  }

  renderFrame(state, mapState, mapConfig);
  spawnCars(state, mapConfig);
  updateTrafficLights(state);
  moveCars(state, mapConfig);
  removeOutOfBoundsCars(state, mapConfig);
  updateCarRoadIndexes(state, mapConfig);

  frameCount++;

  animationFrameId = requestAnimationFrame(() => {
    animate(state, mapState, mapConfig);
  });
}

console.clear();

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gridCanvas");
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Canvas element not found or is not a valid HTMLCanvasElement.");
  }

  const mapState = initialiseMapState(canvas);

  initListeners(state, mapState, mapConfig);
  setupCanvas(state, mapState, mapConfig);

  state.cars = seedCars;

  try {
    animate(state, mapState, mapConfig);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(message);
  }
});
