export interface MapConfig {
  avenueWidth: number;
  bounds: { maxX: number; maxY: number; minX: number; minY: number; };
  cols: number;
  halfAve: number;
  halfSt: number;
  padding: number;
  rows: number;
  streetWidth: number;
  worldHeight: number;
  worldWidth: number;
}

export const mapConfig: MapConfig = {
  avenueWidth: 44,
  bounds: { maxX: 8000, maxY: 8000, minX: 0, minY: 0 },
  cols: 6,
  halfAve: 22,
  halfSt: 14,
  padding: 60,
  rows: 6,
  streetWidth: 28,
  worldHeight: 1000,
  worldWidth: 1000,
};

export const COLOURS = {
  asphalt: "#111215",
  background: "#1c1d21",
  dashLines: "#d97706",
  headlights: "#fef08a",
  laneLines: "rgba(255, 255, 255, 0.25)",
  lightGreen: "#22c55e",
  lightGreenInactive: "#064e3b",
  lightHousing: "#090a0f",
  lightRed: "#ef4444",
  lightRedInactive: "#451a03",
  lightYellow: "#eab308",
  taillights: "#ef4444",
  text: "#9ca3af",
  whiteLines: "rgba(255, 255, 255, 0.8)",
};
