export class IntersectionNotFoundError extends Error {
  constructor(rIndex: number, cIndex: number) {
    super(`Intersection [${rIndex.toString()}][${cIndex.toString()}] does not exist`);
    this.name = "IntersectionNotFoundError";
  }
}
