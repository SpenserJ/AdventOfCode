enum PacketTypes {
  Sum,
  Product,
  Minimum,
  Maximum,
  Literal,
  GreaterThan,
  LessThan,
  EqualTo,
}

interface BasePacket {
  version: number;
  bits: string;
}

type Packet =
  (BasePacket & { value: PacketTypes.Literal })
  | (BasePacket & { value: Exclude<PacketTypes, PacketTypes.Literal>, subpackets: Packet[] });

// eslint-disable-next-line max-len
const packetOperations: Record<Exclude<PacketTypes, PacketTypes.Literal>, (subpackets: Packet[]) => number> = {
  [PacketTypes.Sum]: (subpackets) => subpackets.reduce((acc, next) => acc + next.value, 0),
  [PacketTypes.Product]: (subpackets) => subpackets.reduce((acc, next) => acc * next.value, 1),
  [PacketTypes.Minimum]: (subpackets) => Math.min(...subpackets.map((v) => v.value)),
  [PacketTypes.Maximum]: (subpackets) => Math.max(...subpackets.map((v) => v.value)),
  [PacketTypes.GreaterThan]: (subpackets) => Number(subpackets[0].value > subpackets[1].value),
  [PacketTypes.LessThan]: (subpackets) => Number(subpackets[0].value < subpackets[1].value),
  [PacketTypes.EqualTo]: (subpackets) => Number(subpackets[0].value === subpackets[1].value),
};

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
  const type = bin2dec(eat(3)) as PacketTypes;
  const packet = (() => {
    if (type === 4) {
      let endOfLiteral = false;
      let literalBinary = '';
      while (!endOfLiteral) {
        const literalChunk = eat(5);
        endOfLiteral = literalChunk[0] === '0';
        literalBinary = `${literalBinary}${literalChunk.substring(1)}`;
      }
      return {
        version,
        type,
        value: bin2dec(literalBinary),
        bits: packetBits,
      };
    }

    const lengthType = Number(eat(1));
    const subpackets: Packet[] = [];
    if (lengthType === 0) {
      // The length of the subpacket in bits
      const subpacketsBits = bin2dec(eat(15));
      const targetBit = i + subpacketsBits;
      while (i < targetBit) {
        const subpacket = parsePacket(binaryInput.substring(i, i + subpacketsBits));
        eat(subpacket.bits.length);
        subpackets.push(subpacket);
      }
    } else {
      // The number of subpackets to parse
      const numSubpackets = bin2dec(eat(11));
      for (let s = 0; s < numSubpackets; s += 1) {
        const subpacket = parsePacket(binaryInput.substring(i));
        eat(subpacket.bits.length);
        subpackets.push(subpacket);
      }
    }

    return {
      version,
      type,
      subpackets,
      value: packetOperations[type](subpackets),
      bits: packetBits,
    };
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
  return digForVersions(packet).reduce((acc, next) => acc + next, 0);
};

export const part2 = (rawInput: string) => parseInput(rawInput).value;
