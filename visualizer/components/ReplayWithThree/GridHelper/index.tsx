import { ReplayViewport, useReplayViewport } from "../useReplayViewport";

type GridHelperProps = ReplayViewport & {
  every?: number;
  color?: string;
  z?: number;
}

const GridHelper = ({ every = 5, color = '#aaa', z = 0, ...props }: GridHelperProps) => {
  const { cenX, cenY, largest } = useReplayViewport(props);

  return (
    <gridHelper
      args={[largest, largest / every, color, color]}
      rotation={[Math.PI / 2, 0, 0]}
      position={[cenX, cenY, z]}
    />
  );
};

export default GridHelper;
