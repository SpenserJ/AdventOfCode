import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, InstancedMesh, Object3D } from "three";
import { Camera, GridHelper, ReplayViewport, useReplayViewport } from "..";

const tempObject = new Object3D();

interface Grid2DProps {
  size: ReplayViewport;
  defaultColor: Color;
  getColor: (x: number, y: number) => Color;
  invertY?: boolean;
}

const Grid2D = ({ size, defaultColor, getColor, invertY = false }: Grid2DProps) => {
  const { width, height, minX, maxX, minY, maxY } = useReplayViewport(size);
  const maxSize = width * height;

  const { invalidate } = useThree();
  const instance = useRef<InstancedMesh>();
  const colorArray = useMemo(() => Float32Array.from(new Array(maxSize).fill(defaultColor)), [defaultColor])

  useLayoutEffect(() => {
    let i = 0;
    for (let x = minX; x < maxX; x++) {
      for (let y = minY; y < maxY; y++) {
        const posY = invertY ? minY + (maxY - y) : y;
        tempObject.position.set(x, posY, 0);
        tempObject.updateMatrix()
        instance.current!.setMatrixAt(i, tempObject.matrix)
        i += 1;
      }
    }
    instance.current!.instanceMatrix.needsUpdate = true
  }, [maxSize, minX, maxX, minY, maxY]);

  useLayoutEffect(() => {
    let i = 0;
    for (let x = minX; x < maxX; x += 1) {
        for (let y = minY; y < maxY; y += 1) {
        instance.current!.setColorAt(i, getColor(x, y) || defaultColor);
        i += 1;
      }
    }
    instance.current!.instanceColor!.needsUpdate = true;
    invalidate();
  }, [minX, maxX, minY, maxY, getColor, defaultColor]);

  return (
    <>
      <ambientLight />
      <Camera.Orthographic {...size} />
      <instancedMesh ref={instance} args={[undefined, undefined, width * height]} position={[0, 0, -1]}>
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]}>
          <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 1]} />
        </boxBufferGeometry>
      </instancedMesh>
      <GridHelper {...size} />
    </>
  );
}

export default Grid2D;
