import React, { useEffect, useMemo, useRef } from 'react'
import { MeshProps, useThree } from '@react-three/fiber'
import { BufferGeometry, Color, CubicBezierCurve, Line, LineBasicMaterial, LineSegments, MeshBasicMaterial, PointsMaterial, QuadraticBezierCurve, SplineCurve, Vector2 } from 'three';
import type { NextPage } from 'next'
import Head from 'next/head'
import Day17, { Day17State } from '@spenserj-aoc/2021/day17/solve';
import ReplayWithThree, { Camera, GridHelper } from '../../components/ReplayWithThree';
import Grid2D from '../../components/ReplayWithThree/Grid2D';
import { Replay } from '@spenserj-aoc/utilities/BaseDay';

const input1 = 'target area: x=20..30, y=-10..-5';

const input2 = 'target area: x=155..182, y=-117..-67';

const getKey = (x: number, y: number) => (y << 8) + x;
interface GridProps extends MeshProps {
  currentFrame: Replay<Day17State> | null;
  lastFrame: Replay<Day17State> | null;
}

const colors = [
  new Color('red'),
  new Color('green'),
] as const;

const getPointsForVelocity = (initialVelocity: string, xRange: [number, number], yRange: [number, number]) => {
  let [vX, vY] = initialVelocity.split(',').map((v) => Number(v));
  let x = 0;
  let y = 0;
  let points: Vector2[] = [new Vector2(0, 0)];
  while ((x < xRange[0] || x <= xRange[1]) && (y > yRange[1] || y > yRange[0])) {
    x += vX;
    y += vY;
    points.push(new Vector2(x, y));
    if (xRange[0] <= x && x <= xRange[1] && yRange[1] >= y && y >= yRange[0]) { break; }
    if (vX > 0) { vX -= 1; }
    vY -= 1;
  }
  return points;
};

const getLineSegments = (points: Vector2[]): Vector2[] => {
  let segments: Vector2[] = [];
  for (let i = 0; i < points.length; i += 1) {
    segments.push(points[i]);
    if (i > 0 && i !== points.length - 1) { segments.push(points[i])}
  }
  return segments;
}

const bufferCache: Record<string, { points: Vector2[], segments: Vector2[] }> = {};
const getVectorsForVelocity = (
  initialVelocity: string,
  xRange: [number, number],
  yRange: [number, number],
): { points: Vector2[], segments: Vector2[] } => {
  if (!bufferCache[initialVelocity]) {
    const points = getPointsForVelocity(initialVelocity, xRange, yRange);
    bufferCache[initialVelocity] = {
      points,
      segments: getLineSegments(points),
    }
  }
  return bufferCache[initialVelocity];
}

const geometrySegments = new BufferGeometry();
const geometryNewestSegments = new BufferGeometry();
const geometryZone = new BufferGeometry();
const lineMaterial = new LineBasicMaterial({ color : 0xff0000 });
const newLineMaterial = new LineBasicMaterial({ color : 0x00ff00 });
const zoneMaterial = new LineBasicMaterial({ color: 'yellow' });

const Grid = ({ currentFrame, lastFrame }: GridProps) => {
  const { invalidate } = useThree();
  const state = currentFrame?.state;

  useEffect(() => {
    if (!state) { return; }
    geometryZone.setFromPoints([
      new Vector2(state.xRange[0], state.yRange[0]),
      new Vector2(state.xRange[1], state.yRange[0]),
      new Vector2(state.xRange[1], state.yRange[1]),
      new Vector2(state.xRange[0], state.yRange[1]),
    ])
  }, [state]);

  useEffect(() => {
    if (!state || !state.shotsP2) { return; }
    const segments: Vector2[] = [];
    let lastSegments: Vector2[] = [];
    for (const initialVelocity of state.shotsP2) {
      const result = getVectorsForVelocity(initialVelocity, state.xRange, state.yRange);
      segments.push(...result.segments);
      lastSegments = result.segments;
    }
    geometrySegments.setFromPoints(segments);
    geometryNewestSegments.setFromPoints(lastSegments);
    geometrySegments.computeBoundingBox();
    geometrySegments.computeBoundingSphere();
    geometryNewestSegments.computeBoundingSphere();
    invalidate();
  }, [state]);

  const cameraState = useMemo(() => {
    if (!state) { return { width: 0, height: 0 }; }
    return {
      minX: 0,
      maxX: state.xRange[1],
      minY: state.yRange[0],
      maxY: Math.max(geometrySegments.boundingBox?.max.y || 0, 0),
    };
  }, [state]);

  return (
    <>
      <ambientLight />
      <GridHelper {...cameraState} every={1} color="#111" z={-1} />
      <Camera.Orthographic {...cameraState} />
      <lineSegments geometry={geometrySegments} material={lineMaterial} />
      <lineSegments geometry={geometryNewestSegments} material={newLineMaterial} />
      <lineLoop geometry={geometryZone} material={zoneMaterial} position={[0, 0, 0.1]} />
    </>
  )
}

const Year2021Day17: NextPage = () => (
  <>
    <Head>
      <title key="title">2021 - 20</title>
    </Head>

    <h2>--- Year 2021: Day 20 ---</h2>

    <ReplayWithThree defaultInput={input1} SolveClass={Day17} render={Grid} />
  </>
);

export default Year2021Day17;
