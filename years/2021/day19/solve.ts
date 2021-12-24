type Vector3D = [number, number, number];

const subtract3D = (a: Vector3D, b: Vector3D): Vector3D => ([
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
]);

const add3D = (a: Vector3D, b: Vector3D): Vector3D => ([
  a[0] + b[0],
  a[1] + b[1],
  a[2] + b[2],
]);

const isPositionSame = (a: Vector3D, b: Vector3D): boolean => {
  if (a[0] !== b[0]) { return false; }
  if (a[1] !== b[1]) { return false; }
  if (a[2] !== b[2]) { return false; }
  return true;
};

// A list of matrices with their rotations (-180 to 180 deg) on each axis
type RotationMatrix = [Vector3D, Vector3D, Vector3D];
const rotationMatrices: RotationMatrix[] = [
  /* eslint-disable no-multi-spaces, array-bracket-spacing */
  [[ 1,  0,  0], [ 0,  1,  0], [ 0,  0,  1]],
  [[ 1,  0,  0], [ 0,  0, -1], [ 0,  1,  0]],
  [[ 1,  0,  0], [ 0, -1,  0], [ 0,  0, -1]],
  [[ 1,  0,  0], [ 0,  0,  1], [ 0, -1,  0]],
  [[ 0, -1,  0], [ 1,  0,  0], [ 0,  0,  1]],
  [[ 0,  0,  1], [ 1,  0,  0], [ 0,  1,  0]],
  [[ 0,  1,  0], [ 1,  0,  0], [ 0,  0, -1]],
  [[ 0,  0, -1], [ 1,  0,  0], [ 0, -1,  0]],
  [[-1,  0,  0], [ 0, -1,  0], [ 0,  0,  1]],
  [[-1,  0,  0], [ 0,  0, -1], [ 0, -1,  0]],
  [[-1,  0,  0], [ 0,  1,  0], [ 0,  0, -1]],
  [[-1,  0,  0], [ 0,  0,  1], [ 0,  1,  0]],
  [[ 0,  1,  0], [-1,  0,  0], [ 0,  0,  1]],
  [[ 0,  0,  1], [-1,  0,  0], [ 0, -1,  0]],
  [[ 0, -1,  0], [-1,  0,  0], [ 0,  0, -1]],
  [[ 0,  0, -1], [-1,  0,  0], [ 0,  1,  0]],
  [[ 0,  0, -1], [ 0,  1,  0], [ 1,  0,  0]],
  [[ 0,  1,  0], [ 0,  0,  1], [ 1,  0,  0]],
  [[ 0,  0,  1], [ 0, -1,  0], [ 1,  0,  0]],
  [[ 0, -1,  0], [ 0,  0, -1], [ 1,  0,  0]],
  [[ 0,  0, -1], [ 0, -1,  0], [-1,  0,  0]],
  [[ 0, -1,  0], [ 0,  0,  1], [-1,  0,  0]],
  [[ 0,  0,  1], [ 0,  1,  0], [-1,  0,  0]],
  [[ 0,  1,  0], [ 0,  0, -1], [-1,  0,  0]],
  /* eslint-enable no-multi-spaces, array-bracket-spacing */
];

const rotate3D = (pos: Vector3D, matrix: RotationMatrix): Vector3D => ([
  (pos[0] * matrix[0][0]) + (pos[1] * matrix[0][1]) + (pos[2] * matrix[0][2]),
  (pos[0] * matrix[1][0]) + (pos[1] * matrix[1][1]) + (pos[2] * matrix[1][2]),
  (pos[0] * matrix[2][0]) + (pos[1] * matrix[2][1]) + (pos[2] * matrix[2][2]),
]);

// Compare an oriented pair with an unoriented pair
// Test each rotation matrix by:
// * pairOffset = oriented[0] - oriented[1]
// * correctOrientation = pairOffset === unoriented[0] - unoriented[1]
// * correctTransform = oriented[0] - unoriented[0]
// Need to ensure we're comparing the same beacons in each pair
export const findPossibleTransforms = (
  from: Vector3D,
  to: Vector3D,
): [RotationMatrix, Vector3D][] | false => {
  const options: [RotationMatrix, Vector3D][] = [];
  for (let m = 0; m < rotationMatrices.length; m += 1) {
    const matrix = rotationMatrices[m];
    const rotated = rotate3D(from, matrix);
    const offset = subtract3D(to, rotated);
    options.push([matrix, offset]);
  }
  return options;
};

export const selectRotationAndTransformation = (
  orientationOptions: [RotationMatrix, Vector3D][],
  checkVectorsWithDistances: Map<number, Beacon>,
  againstVectorsWithDistances: Map<number, Beacon>,
) => orientationOptions.find(([matrix, translate]) => {
  let verified = 0;
  for (const [dist, check] of checkVectorsWithDistances) {
    // Not all of the neighbours may be known, so skip those that aren't
    const against = againstVectorsWithDistances.get(dist);
    if (!against) { continue; }
    const transformed = add3D(rotate3D(check.position, matrix), translate);
    if (!isPositionSame(transformed, against.position)) { return false; }
    verified += 1;
  }
  return verified >= 11;
});

class Beacon {
  public neighbourByDist: Map<number, Beacon> = new Map();

  public hopefullyUnique: number;

  constructor(public position: Vector3D) {
    const absCoords = position.map((v) => Math.abs(v)).sort();
    this.hopefullyUnique = ((absCoords[1] - absCoords[0]) * (absCoords[2] - absCoords[0]));
  }

  addNeighbours(neighbours: Beacon[]) {
    const from = this.position;
    for (let i = 0; i < neighbours.length; i += 1) {
      // Don't add ourselves as a neighbour
      if (this === neighbours[i]) { continue; }
      const to = neighbours[i].position;
      // This isn't a proper distance because we skip the sqrt for performance
      const dist = ((from[0] - to[0]) ** 2) + ((from[1] - to[1]) ** 2) + ((from[2] - to[2]) ** 2);
      // TODO: Do we need to worry about duplicate distances?
      this.neighbourByDist.set(dist, neighbours[i]);
    }
  }
}

class BeaconScanner {
  public position: Vector3D;

  public beacons: Beacon[] = [];

  public orientationBeacon: Beacon;

  constructor(public id: number, visibleBeaconPoints: Vector3D[]) {
    this.position = [0, 0, 0];
    this.setBeacons(visibleBeaconPoints);
  }

  public setBeacons(visibleBeaconPoints: Vector3D[]): void {
    this.beacons = visibleBeaconPoints.map((v) => new Beacon(v));
    this.beacons.forEach((beacon) => beacon.addNeighbours(this.beacons));
  }

  public orientScanner(ourBeacon: Beacon, theirBeacon: Beacon): boolean {
    const transformOptions = findPossibleTransforms(
      ourBeacon.position,
      theirBeacon.position,
    );
    if (transformOptions === false) { return false; }

    const result = selectRotationAndTransformation(
      transformOptions,
      ourBeacon.neighbourByDist,
      theirBeacon.neighbourByDist,
    );
    if (!result) { return false; }

    const [matrix, translate] = result;
    this.position = translate;
    this.setBeacons(this.beacons.map((v) => add3D(rotate3D(v.position, matrix), translate)));
    return true;
  }

  public attemptOrientation(withBeacons: Beacon[]): boolean {
    for (let i = 0; i < this.beacons.length; i += 1) {
      const beacon = this.beacons[i];
      for (let j = 0; j < withBeacons.length; j += 1) {
        const withBeacon = withBeacons[j];
        let count = 0;
        for (const key of beacon.neighbourByDist.keys()) {
          if (withBeacon.neighbourByDist.has(key)) { count += 1; }
          if (count >= 11) {
            if (this.orientScanner(beacon, withBeacon)) { return true; }
            break;
          }
        }
        // We already tried orienting with this beacon, so try the next one
        if (count >= 11) { break; }
      }
    }
    return false;
  }
}
class BeaconScannerCoordinator {
  public orientationBeacons: Beacon[];

  /**
   * The scanners that have been successfully oriented
   */
  public scanners: BeaconScanner[];

  public unorientedScanners: BeaconScanner[];

  constructor(scanners: BeaconScanner[]) {
    // The first scanner is oriented and positioned correctly
    this.scanners = [scanners[0]];
    this.orientationBeacons = [...scanners[0].beacons];
    this.unorientedScanners = scanners.slice(1);
  }

  public step() {
    for (let i = 0; i < this.unorientedScanners.length; i += 1) {
      const checkScanner = this.unorientedScanners[i];
      if (checkScanner.attemptOrientation(this.scanners[0].beacons)) {
        // Merge the known beacons into the coordinator's orientation beacon
        const allPositions = [...this.scanners[0].beacons, ...checkScanner.beacons]
          .map((v) => v.position);
        const positionStrings = allPositions.map((v) => v.toString());
        this.scanners[0].setBeacons(
          allPositions.filter((v, j) => positionStrings.indexOf(v.toString()) === j),
        );
        this.scanners.push(checkScanner);
        this.unorientedScanners.splice(i, 1);
        return;
      }
    }
    throw new Error('Could not orient any scanners');
  }

  public run() {
    while (this.unorientedScanners.length > 0) { this.step(); }
  }
}

export const parseInput = (rawInput: string): BeaconScannerCoordinator => {
  const blocks = rawInput.trim().split('\n\n');
  const scanners = blocks.map((block, i) => {
    const [, ...rawPoints] = block.split('\n');
    return new BeaconScanner(i, rawPoints.map((p) => p.split(',').map((v) => Number(v)) as Vector3D));
  });
  return new BeaconScannerCoordinator(scanners);
};

export const part1 = (rawInput: string) => {
  const coordinator = parseInput(rawInput);
  coordinator.run();
  return coordinator.scanners[0].beacons.length;
};

export const part2 = (rawInput: string) => {
  const coordinator = parseInput(rawInput);
  coordinator.run();
  let largest = 0;
  for (let i = 0; i < coordinator.scanners.length; i += 1) {
    const compareTo = coordinator.scanners[i].position;
    for (let j = i + 1; j < coordinator.scanners.length; j += 1) {
      const pos = coordinator.scanners[j].position;
      const distance = Math.abs(compareTo[0] - pos[0])
        + Math.abs(compareTo[1] - pos[1])
        + Math.abs(compareTo[2] - pos[2]);
      largest = Math.max(distance, largest);
    }
  }
  return largest;
};
