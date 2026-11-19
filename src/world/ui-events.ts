import type { MapConfig } from "../config";
import type { MapState, State } from "../state";

import { renderFrame } from "../draw/draw";
import { resetView, setupCanvas } from "../world/controls";

let isDragging = false;
let startX = 0;
let startY = 0;
let initialPanX = 0;
let initialPanY = 0;

export function initListeners(state: State, mapState: MapState, mapConfig: MapConfig): void {
  window.addEventListener("resize", () => {
    setupCanvas(state, mapState, mapConfig);
  });

  window.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    // Store where the pan was when the drag started
    initialPanX = mapState.panX;
    initialPanY = mapState.panY;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    mapState.panX = initialPanX + (e.clientX - startX);

    mapState.panY = initialPanY - (e.clientY - startY);

    renderFrame(state, mapState, mapConfig);
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  mapState.canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const newScale = Math.min(Math.max(0.4, mapState.scale * zoomFactor), 4);

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      mapState.panX = mouseX - (mouseX - mapState.panX) * (newScale / mapState.scale);
      mapState.panY = mouseY - (mouseY - mapState.panY) * (newScale / mapState.scale);
      mapState.scale = newScale || 1;

      renderFrame(state, mapState, mapConfig);
    },
    { passive: false }
  );

  // UI Buttons
  const zoomInBtn = document.getElementById("btn-zoom-in");
  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => {
      mapState.scale = Math.min(4, mapState.scale * 1.2);
      renderFrame(state, mapState, mapConfig);
    });
  }

  const zoomOutBtn = document.getElementById("btn-zoom-out");
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => {
      mapState.scale = Math.max(0.4, mapState.scale / 1.2);
      renderFrame(state, mapState, mapConfig);
    });
  }

  const resetViewBtn = document.getElementById("btn-reset-view");
  if (resetViewBtn) {
    resetViewBtn.addEventListener("click", () => {
      resetView(state, mapState, mapConfig);
    });
  }
}
