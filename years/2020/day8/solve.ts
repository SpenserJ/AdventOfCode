const validOperations = ['acc', 'jmp', 'nop'] as const;

type Operation = typeof validOperations[number];

interface Instruction {
  op: Operation;
  val: number;
  index: number;
  called: boolean;
}

const isOperation = (v: any): v is Operation => validOperations.includes(v);

class StackLoopError extends Error {
  constructor(public stacktrace: Instruction[], public accumulator: number) {
    super(`Infinite loop detected. Final accumulator: ${accumulator}`);
    this.name = 'StackLoopError';
    const stackLines = [...stacktrace]
      .reverse()
      .map((inst) => `    at ${inst.op} ${inst.val} (${inst.index})`)
      .join('\n');
    this.stack = `${this.message}\n${stackLines}`;
  }
}

const parseInput = (input: string): Instruction[] => input
  .trim()
  .split('\n')
  .map((line, index) => {
    const [op, val] = line.split(' ');
    if (!isOperation(op)) { throw new Error(`Invalid operation: ${op}`); }
    return {
      op,
      val: parseInt(val, 10),
      index,
      called: false,
    };
  });

const execute = (instructions: Instruction[]) => {
  let accumulator = 0;
  const stacktrace: Instruction[] = [];
  let nextIndex = 0;
  while (nextIndex >= 0 && nextIndex < instructions.length) {
    const nextInstruction: Instruction = instructions[nextIndex];
    stacktrace.push(nextInstruction);
    stacktrace.splice(0, stacktrace.length - 10);

    // If we've already seen this instruction, return the accumulator
    if (nextInstruction.called) {
      throw new StackLoopError(stacktrace, accumulator);
    }
    nextInstruction.called = true;

    if (nextInstruction.op === 'jmp') {
      nextIndex += nextInstruction.val;
      continue;
    } else {
      nextIndex += 1;
    }

    if (nextInstruction.op === 'nop') { continue; }

    if (nextInstruction.op === 'acc') {
      accumulator += nextInstruction.val;
      continue;
    }

    // Failed to process the instruction
    throw new Error(`Invalid operation: ${nextInstruction.op}`);
  }

  return accumulator;
};

export const part1 = (input: string) => {
  try {
    const instructions = parseInput(input);
    return execute(instructions);
  } catch (e) {
    if (e instanceof StackLoopError) {
      return e.accumulator;
    }
    throw e;
  }
};

const flipJmpNop = (instruction: Instruction) => {
  if (instruction.op === 'jmp') {
    instruction.op = 'nop'; // eslint-disable-line no-param-reassign
  } else if (instruction.op === 'nop') {
    instruction.op = 'jmp'; // eslint-disable-line no-param-reassign
  }
};

export const part2 = (input: string) => {
  const instructions = parseInput(input);
  let flippedIndex = -1;
  while (flippedIndex < instructions.length) {
    if (flippedIndex >= 0) { flipJmpNop(instructions[flippedIndex]); }
    // Clear the called flag on all instructions
    for (let i = 0; i < instructions.length; i += 1) { instructions[i].called = false; }

    try {
      return execute(instructions);
    } catch (e) {
      if (e instanceof StackLoopError) {
        if (flippedIndex >= 0) { flipJmpNop(instructions[flippedIndex]); }
        flippedIndex += 1;
        continue;
      }
      throw e;
    }
  }
  return undefined;
};
