import { ReplayViewport, useReplayViewport } from "../useReplayViewport";

const GridHelper = (props: ReplayViewport) => {
  const { cenX, cenY, largest } = useReplayViewport(props);

  return (
    <gridHelper
      args={[largest, largest / 5, '#aaa', '#aaa']}
      rotation={[Math.PI / 2, 0, 0]}
      position={[cenX, cenY, 0]}
    />
  );
};

export default GridHelper;
