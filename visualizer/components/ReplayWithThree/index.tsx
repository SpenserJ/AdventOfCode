import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import BaseDay from '@spenserj-aoc/utilities/BaseDay';
import styled from 'styled-components';

export * as Camera from './Camera';
export { default as GridHelper } from './GridHelper';
export * from './useReplayViewport';

const useSolver = <T extends BaseDay<any>>(solverInstance: T) => {
  const [state, setState] = useState<typeof solverInstance["state"]>(solverInstance.state);
  return useMemo(() => ({
    trackStep: () => {
      solverInstance.trackStep();
      setState(solverInstance.state);
    },
    solve: (): void => {
      solverInstance.solve();
      setState(solverInstance.state);
    },
    state,
  }), [solverInstance, state]);
};

const useSolverReplay = <T extends BaseDay<any>>(solverInstance: T) => {
  const [replay, setReplay] = useState<ReturnType<typeof solverInstance["render"]["getData"]>>();
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const solver = useSolver(solverInstance);
  useEffect(() => {
    solver.solve();
    setCurrentFrameIndex(0);
    setReplay(solverInstance.render.getData() as ReturnType<typeof solverInstance["render"]["getData"]>);
  }, [solverInstance]);

  const currentFrame = useMemo(() => replay?.[currentFrameIndex] ?? null, [replay, currentFrameIndex]);
  const setNextFrame = useCallback(() => {
    if (!replay || currentFrameIndex === replay.length - 1) { return; }
    setCurrentFrameIndex((v) => v + 1);
  }, [replay, currentFrameIndex]);
  const setPrevFrame = useCallback(() => {
    if (!replay || currentFrameIndex === 0) { return; }
    setCurrentFrameIndex((v) => v - 1);
  }, [replay, currentFrameIndex]);

  return {
    currentFrame,
    currentFrameIndex,
    allFrames: replay,
    setNextFrame,
    setPrevFrame,
    setFrame: setCurrentFrameIndex,
  };
};

const ReplayWithThreeContainer = styled.div`
  display: flex;
`;

const CanvasContainer = styled.div`
  height: 80vh;
  flex-grow: 1;
`;

const ReplayListContainer = styled.div`
  height: 80vh;
`;

type Class<T> = new (...args: any[]) => T;

interface ReplayWithThreeProps {
  defaultInput: string;
  SolveClass: Class<BaseDay<any>>;
  render: React.ElementType;
  defaultPlaybackSpeed?: number;
}

const ReplayWithThree = ({
  defaultInput,
  SolveClass,
  render: RenderComponent,
  defaultPlaybackSpeed = 200,
}: ReplayWithThreeProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState(defaultInput);
  const solver = useMemo(() => new SolveClass(input), [SolveClass, input]);
  const { allFrames, currentFrame, currentFrameIndex, setNextFrame, setFrame } = useSolverReplay(solver);
  const lastFrame = useMemo(() => allFrames?.[allFrames.length - 1] ?? null, [allFrames]);

  const [playing, setPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(defaultPlaybackSpeed);

  useEffect(() => {
    if (!playing) { return; }
    const timeout = setTimeout(setNextFrame, playbackSpeed);
    return () => clearTimeout(timeout);
  }, [setNextFrame, playing, playbackSpeed]);

  return (
    <ReplayWithThreeContainer>
      <CanvasContainer>
        <Canvas frameloop="demand">
          <RenderComponent currentFrame={currentFrame} lastFrame={lastFrame} />
        </Canvas>
      </CanvasContainer>
      <ReplayListContainer>
        <textarea ref={inputRef} defaultValue={defaultInput} />
        <button onClick={() => setInput(inputRef.current!.value)}>Update Input</button>
        <br />
        <button onClick={() => setPlaying(!playing)}>{playing ? 'Pause' : 'Play'}</button>
        <input
          type="range"
          min={20}
          max={1000}
          step={10}
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
        />
        {`${playbackSpeed}ms/frame`}
        <ul>
          {allFrames?.map((v, i) => (
            <li key={i} style={{ background: i === currentFrameIndex ? 'wheat' : 'white' }} onClick={() => setFrame(i)}>
              {JSON.stringify(v.labels)}
            </li>
          ))}
        </ul>
      </ReplayListContainer>
    </ReplayWithThreeContainer>
  )
}

export default ReplayWithThree;
