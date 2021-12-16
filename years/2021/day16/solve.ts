import { sum } from '@spenserj-aoc/utilities';

interface BasePacket {
  version: number;
  type: number;
  value: number;
  bits: string;
}
type OperatorPacket = BasePacket & { subpackets: Packet[] };

type SumPacket = OperatorPacket & { type: 0 };
type ProductPacket = OperatorPacket & { type: 1 };
type MinimumPacket = OperatorPacket & { type: 2 };
type MaximumPacket = OperatorPacket & { type: 3 };
type LiteralPacket = BasePacket & { type: 4 };
type GreaterThanPacket = OperatorPacket & { type: 5 };
type LessThanPacket = OperatorPacket & { type: 6 };
type EqualToPacket = OperatorPacket & { type: 7 };

type Packet =
  SumPacket
  | ProductPacket
  | MinimumPacket
  | MaximumPacket
  | LiteralPacket
  | GreaterThanPacket
  | LessThanPacket
  | EqualToPacket;

type PacketType = Packet['type'];

export const hex2bin = (input: string) => input
  .split('')
  .map((v) => parseInt(v, 16).toString(2).padStart(4, '0'))
  .join('');

const bin2dec = (input: string) => parseInt(input, 2);

export const parsePacket = (binaryInput: string): Packet => {
  let i = 0;
  let packetBits = '';
  const eat = (bits: number): string => {
    const consumed = binaryInput.substring(i, i + bits);
    i += consumed.length;
    packetBits = `${packetBits}${consumed}`;
    return consumed;
  };

  const version = bin2dec(eat(3));
  const type = bin2dec(eat(3)) as PacketType;
  const packet = (() => {
    if (type === 4) {
      let endOfLiteral = false;
      let literalBinary = '';
      while (!endOfLiteral) {
        const literalChunk = eat(5);
        endOfLiteral = literalChunk[0] === '0';
        literalBinary = `${literalBinary}${literalChunk.substring(1)}`;
      }
      const value = bin2dec(literalBinary);
      return {
        version,
        type,
        value,
        bits: packetBits,
      };
    }

    const lengthType = Number(eat(1));
    const subpackets: Packet[] = [];
    // The length of the subpacket in bits
    if (lengthType === 0) {
      const subpacketsBits = bin2dec(eat(15));
      const targetBit = i + subpacketsBits;
      while (i < targetBit) {
        const subpacket = parsePacket(binaryInput.substring(i, i + subpacketsBits));
        eat(subpacket.bits.length);
        subpackets.push(subpacket);
      }
    } else {
      const numSubpackets = bin2dec(eat(11));
      for (let s = 0; s < numSubpackets; s += 1) {
        const subpacket = parsePacket(binaryInput.substring(i));
        eat(subpacket.bits.length);
        subpackets.push(subpacket);
      }
    }

    const packetBase = {
      version,
      type,
      value: 0,
      subpackets,
      bits: packetBits,
    };
    if (type === 0) {
      const value = sum(subpackets.map((v) => v.value));
      return { ...packetBase, value } as SumPacket;
    }
    if (type === 1) {
      const value = subpackets.reduce((acc, next) => acc * next.value, 1);
      return { ...packetBase, value } as ProductPacket;
    }
    if (type === 2) {
      const value = Math.min(...subpackets.map((v) => v.value));
      return { ...packetBase, value } as MinimumPacket;
    }
    if (type === 3) {
      const value = Math.max(...subpackets.map((v) => v.value));
      return { ...packetBase, value } as MaximumPacket;
    }
    if (type === 5) {
      const value = Number(subpackets[0].value > subpackets[1].value);
      return { ...packetBase, value } as GreaterThanPacket;
    }
    if (type === 6) {
      const value = Number(subpackets[0].value < subpackets[1].value);
      return { ...packetBase, value } as GreaterThanPacket;
    }
    if (type === 7) {
      const value = Number(subpackets[0].value === subpackets[1].value);
      return { ...packetBase, value } as GreaterThanPacket;
    }
    throw new Error(`Couldn't process packet of type: ${type}`);
  })();

  return packet;
};

export const parseInput = (rawInput: string): Packet => parsePacket(hex2bin(rawInput));

export const part1 = (rawInput: string) => {
  const packet = parseInput(rawInput);
  const digForVersions = (inPacket: Packet): number[] => (
    ('subpackets' in inPacket ? inPacket.subpackets : [])
      .flatMap((subpacket) => digForVersions(subpacket))
      .concat(inPacket.version)
  );
  return sum(digForVersions(packet));
};

export const part2 = (rawInput: string) => parseInput(rawInput).value;
