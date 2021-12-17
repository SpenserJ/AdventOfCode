import BucketQueue from '.';

describe('PriorityQueues', () => {
  test('BucketQueue', () => {
    const queue = new BucketQueue<number>();
    queue
      .insert(1, 1)
      .insert(1, 1)
      .insert(2, 2)
      .insert(4, 4)
      .insert(5, 5)
      .remove(1, 1);

    expect(queue.pull()).toEqual(1);
    expect(queue.pull()).toEqual(2);
    expect(queue.pull()).toEqual(4);
    queue.insert(3, 3);
    expect(queue.pull()).toEqual(3);
    expect(queue.pull()).toEqual(5);
  });
});
