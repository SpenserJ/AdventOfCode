/**
 *
 * @param input The data that should be bisected
 * @param testFn Return true if the value is in the right partition and
 *   false if it is in the left partition
 * @returns The value and index of the last item in the left partition
 */
const bisect = <T = any>(input: T[], testFn: (value: T) => boolean): [T, number] => {
  let workingData = input;
  let lastLeftIndex = 0;
  while (workingData.length > 1) {
    const midpoint = Math.ceil(workingData.length / 2);
    const isRightPartition = testFn(workingData[midpoint]);
    if (isRightPartition) {
      workingData = workingData.slice(0, midpoint);
    } else {
      workingData = workingData.slice(midpoint);
      lastLeftIndex += midpoint;
    }
  }
  return [workingData[0], lastLeftIndex];
};

export default bisect;
