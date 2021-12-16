import {
  hex2bin,
  parseInput,
  part1,
  part2,
} from './solve';

describe('2020/12/16', () => {
  test('hex2bin', () => {
    expect(hex2bin('D2FE28')).toEqual('110100101111111000101000');
    expect(hex2bin('38006F45291200')).toEqual('00111000000000000110111101000101001010010001001000000000');
    expect(hex2bin('EE00D40C823060')).toEqual('11101110000000001101010000001100100000100011000001100000');
  });

  test('parseInput', () => {
    expect(parseInput('D2FE28')).toEqual({
      version: 6,
      type: 4,
      value: 2021,
      bits: '110100101111111000101',
    });
    expect(parseInput('38006F45291200')).toEqual({
      version: 1,
      type: 6,
      value: 1,
      bits: '0011100000000000011011110100010100101001000100100',
      subpackets: [
        {
          version: 6,
          type: 4,
          value: 10,
          bits: '11010001010',
        },
        {
          version: 2,
          type: 4,
          value: 20,
          bits: '0101001000100100',
        },
      ],
    });

    expect(parseInput('EE00D40C823060')).toEqual({
      version: 7,
      type: 3,
      value: 3,
      bits: '111011100000000011010100000011001000001000110000011',
      subpackets: [
        {
          version: 2,
          type: 4,
          value: 1,
          bits: '01010000001',
        },
        {
          version: 4,
          type: 4,
          value: 2,
          bits: '10010000010',
        },
        {
          version: 1,
          type: 4,
          value: 3,
          bits: '00110000011',
        },
      ],
    });
  });

  test('Part 1', () => {
    expect(part1('8A004A801A8002F478')).toEqual(16);
    expect(part1('620080001611562C8802118E34')).toEqual(12);
    expect(part1('C0015000016115A2E0802F182340')).toEqual(23);
    expect(part1('A0016C880162017C3686B18A3D4780')).toEqual(31);
  });

  test('Part 2', () => {
    expect(part2('C200B40A82')).toEqual(3);
    expect(part2('04005AC33890')).toEqual(54);
    expect(part2('880086C3E88112')).toEqual(7);
    expect(part2('CE00C43D881120')).toEqual(9);
    expect(part2('D8005AC2A8F0')).toEqual(1);
    expect(part2('F600BC2D8F')).toEqual(0);
    expect(part2('9C005AC2F8F0')).toEqual(0);
    expect(part2('9C0141080250320F1802104A08')).toEqual(1);
  });
});
