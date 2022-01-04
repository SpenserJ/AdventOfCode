type Next<T> = { value: T, done: false } | { done: true };

export interface SeekableIterator<T> {
  // next: () => { value?: T, done: boolean };
  next: () => Next<T>;
  seek: (newIndex: number) => void;
}

const makeSeekableIterator = <T>(arr: T[]): SeekableIterator<T> => {
  let nextIndex = 0;
  return {
    next: () => {
      const value = nextIndex < arr.length
        ? { value: arr[nextIndex], done: false }
        : { done: true };
      nextIndex += 1;
      return value as Next<T>;
    },
    seek: (newIndex: number): void => {
      nextIndex = newIndex;
    },
  };
};

export default makeSeekableIterator;
