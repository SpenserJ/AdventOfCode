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

  // This is required to keep the cells within their grid lines
  const shiftedMaxX = ((maxX - minX) % 2 === 0) ? maxX + 1 : maxX;
  const shiftedMaxY = ((maxY - minY) % 2 === 0) ? maxY + 1 : maxY;

  const width = shiftedMaxX - minX;
  const height = shiftedMaxY - minY;
  const largest = Math.max(width, height);
  const cenX = Math.floor(minX / 2) + Math.floor(shiftedMaxX / 2);
  const cenY = Math.floor(minY / 2) + Math.floor(shiftedMaxY / 2);
  return useMemo(() => ({
    minX,
    maxX: shiftedMaxX,
    minY,
    maxY: shiftedMaxY,
    width,
    height,
    largest,
    cenX,
    cenY,
  }), [minX, maxX, minY, maxY, width, height, largest]);
};
