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

  const currentFrame = useMemo(() => replay?.[currentFrameIndex].state ?? null, [replay, currentFrameIndex]);
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
}

const ReplayWithThree = ({ defaultInput, SolveClass, render: RenderComponent }: ReplayWithThreeProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState(defaultInput);
  const solver = useMemo(() => new SolveClass(input), [SolveClass, input]);
  const { allFrames, currentFrame, currentFrameIndex, setNextFrame, setFrame } = useSolverReplay(solver);
  const lastFrame = useMemo(() => allFrames?.[allFrames.length - 1].state ?? null, [allFrames]);

  useEffect(() => {
    const timeout = setTimeout(setNextFrame, 200);
    return () => clearTimeout(timeout);
  }, [setNextFrame]);

  return (
    <ReplayWithThreeContainer>
      <CanvasContainer>
        <Canvas frameloop="demand">
          <RenderComponent state={currentFrame} lastFrame={lastFrame} />
        </Canvas>
      </CanvasContainer>
      <ReplayListContainer>
        <textarea ref={inputRef} defaultValue={defaultInput} />
        <button onClick={() => setInput(inputRef.current!.value)}>Update Input</button>
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
