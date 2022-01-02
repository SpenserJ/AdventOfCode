import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import { OrthographicCamera } from "three";
import { ReplayViewport, useReplayViewport } from "../useReplayViewport";

export const Orthographic = (props: ReplayViewport) => {
  const { largest, cenX, cenY } = useReplayViewport(props);
  const ref = useRef<OrthographicCamera>()
  const set = useThree(state => state.set)
  // Make the camera known to the system
  useLayoutEffect(() => {
    ref.current!.position.set(cenX, cenY, 1);
    set({ camera: ref.current! });
  }, []);

  // Update it every frame
  useFrame(() => {
    if (!ref.current) { return; }

    ref.current.zoom = 2 / largest;
    ref.current.position.set(cenX, cenY, 1);
    ref.current.updateProjectionMatrix();
    ref.current.updateMatrixWorld();
  });
  return <orthographicCamera ref={ref} />;
};

export const Perspective = () => null;
