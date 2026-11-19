export interface Car {
  angle: number;
  avenueIndex: number;
  colour: string;
  id: number;
  length: number;
  speed: number;
  streetIndex: number;
  width: number;
  x: number;
  y: number;
}

export interface Intersection {
  duration: number;
  isAvenueGreen: boolean;
  timer: number;
  x: number;
  y: number;
}

export interface MapState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  panX: number;
  panY: number;
  scale: number;
}

export interface State {
  avenuesX: Float32Array;
  cars: Car[];
  intersections: Intersection[][];
  lightPhase: number; // 0 or 1, representing the alternating phase
  lightTimer: number;
  streetsY: Float32Array;
}

export function initialiseMapState(canvas: HTMLCanvasElement): MapState {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get 2D rendering context from canvas");
  }

  return {
    canvas,
    ctx,
    panX: 0,
    panY: 0,
    scale: 1,
  };
}

export const state: State = {
  avenuesX: new Float32Array,
  cars: [],
  intersections: [],
  lightPhase: 0,
  lightTimer: 0,
  streetsY: new Float32Array,
};
