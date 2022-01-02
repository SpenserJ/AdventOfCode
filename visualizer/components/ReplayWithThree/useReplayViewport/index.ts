import { useMemo } from "react";

export type ReplayViewport =  {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} | {
  width: number;
  height: number;
};

export const useReplayViewport = (viewport: ReplayViewport) => {
  const { minX, maxX, minY, maxY } = ('width' in viewport && 'height' in viewport)
      ? { minX: 0, maxX: viewport.width, minY: 0, maxY: viewport.height }
      : viewport;

  const width = maxX - minX;
  const height = maxY - minY;
  const largest = Math.max(width, height);
  const cenX = Math.floor(minX / 2) + Math.floor(maxX / 2);
  const cenY = Math.floor(minY / 2) + Math.floor(maxY / 2);
  return useMemo(() => ({
    minX,
    maxX,
    minY,
    maxY,
    width,
    height,
    largest,
    cenX,
    cenY,
  }), [minX, maxX, minY, maxY, width, height, largest]);
};
