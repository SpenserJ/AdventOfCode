const memoize = <
  T extends (...args: any[]) => any,
  TKey extends (...args: Parameters<T>) => string,
>(fn: T, keyFn: TKey) => {
  const cache = new Map<string, any>();
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = keyFn(...args);
    if (cache.has(key)) { return cache.get(key); }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

export default memoize;
