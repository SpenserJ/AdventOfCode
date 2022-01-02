import React from 'react'
import { MeshProps } from '@react-three/fiber'
import { Color } from 'three';
import type { NextPage } from 'next'
import Head from 'next/head'
import Day23, { adjustedHallIndex, GameState, ReplayState, validAmphipods } from '@spenserj-aoc/2021/day23/solve';
import ReplayWithThree from '../../components/ReplayWithThree';
import Grid2D from '../../components/ReplayWithThree/Grid2D';

const input1 = `
#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`.trim();

const input2 = `
#############
#...........#
###A#D#C#A###
  #C#D#B#B#
  #########`.trim();

const getKey = (x: number, y: number) => (y << 8) + x;

interface GridProps extends MeshProps {
  currentFrame: ReplayState | null;
}

const colors = [
  new Color('black'),
  new Color('grey'),
  new Color('orange'),
  new Color('blue'),
  new Color('red'),
  new Color('green'),
] as const;

const Grid = ({ currentFrame }: GridProps) => {
  const state = currentFrame?.currentNode;
  const roomSize = state?.rooms[0].amphipods.length ?? 2;

  const cameraState = {
    width: 13,
    height: 3 + roomSize,
  };

  return (
    <Grid2D
      defaultColor={colors[0]}
      getColor={(x, y) => {
        // Ceiling
        if (y === roomSize + 2) { return colors[1]; }
        // Hallway
        if (y === roomSize + 1) {
          if (x === 0 || x === 12) { return colors[1]; }
          if (!state) { return colors[0]; }
          const amphipod = state.hallway[adjustedHallIndex.indexOf(x - 1)];
          if (typeof amphipod === 'undefined' || amphipod === '.') { return colors[0]; }
          return colors[validAmphipods.indexOf(amphipod) + 2];
        }
        // First row with rooms
        if (y === roomSize && (x < 3 || x > 9)) { return colors[1]; }
        if (x < 2 || x > 10) { return colors[0]; }
        if (x % 2 === 0) { return colors[1]; }
        if (y === 0 && x > 2 && x < 10) { return colors[1]; }
        if (!state) { return colors[0]; }
        const roomIndex = (x - 3) / 2;
        const amphipodIndex = roomSize - (y);
        const amphipod = state?.rooms[roomIndex].amphipods[amphipodIndex];
        if (amphipod === '.') { return colors[0]; }
        return colors[validAmphipods.indexOf(amphipod) + 2];
      }}
      size={cameraState}
    />
  )
}

const Year2021Day23: NextPage = () => (
  <>
    <Head>
      <title key="title">2021 - 23</title>
    </Head>

    <h2>--- Year 2021: Day 23 ---</h2>

    <ReplayWithThree defaultInput={input1} SolveClass={Day23} render={Grid} />
  </>
);

export default Year2021Day23;
