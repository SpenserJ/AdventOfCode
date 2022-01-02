import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, MeshProps, useFrame, useThree } from '@react-three/fiber'
import { Color, InstancedMesh, Object3D, OrthographicCamera } from 'three';
import type { NextPage } from 'next'
import Head from 'next/head'
import Day25, { State, Spot, renderSeaFloor } from '@spenserj-aoc/2021/day25/solve';
import BaseDay from '@spenserj-aoc/utilities/BaseDay';
import ReplayWithThree, { Camera, GridHelper } from '../../components/ReplayWithThree';

const input1 = `
.>vv....vv>.v.vv....v>vv>.v>..vv.>.v...v...>v>v.>.>.>..>..>.>v...>>v.v>...vv.v.>.>.vv.vv.v...v.>vvv>>.>...v>..>.>..>v.>.>.v.>...>.>.v..v.>v
>........v>...>>..vv>v>v.v.....v.>>...>>v>>.vv....>.>...v>v>vvv....>.....>.v....vvv.>...v>.>>.>>..>...v..>.>....>>.v>.>.v..>...>.>>..v..vv.
>.>...v..>..v.vv.v>.>.>>v.vvvvv.vv..vv.....v.vv..>.vv>v..>.>.......>...>>>.vvvv>>....v>v.>...>>vv....vv.>........>>..>>..v..>...>..vv>.....
....v.>v>v>v>>..>v.>>..v....>>>...>>.v.>>v>..vv.>....v>.vv.v.v.>.>.v>.v>.vv.vv>>v.vv.v.>..>v...>>v....v>.....v>.....v>..>.>.>.>>>.>.>>>..>>
.>>...>.vv.v....>.vv.v>>..>.>.>>..>.>v.>vv...v.>.>...v>>.>...>.>>>.>........>.vv.v.>vv>v...>v.>.v....v..v.......vvv.>.>v...vv>.v>>>.v.>v...
.v.....>>....v.>v.>>....>v>>...v>>..v..v.v...v..>>..v>....v...>.>>>.v>>>.v.vv.v..>>.vvv..>>v>>..v>v....>v.v>.v>.v.>....>..>>.v.v..>.>>v....
.>..v.vv..vv>vv..>.>v>>..>.>v>..>>...>.>..v.vv>v.v>....>.vv.vv>>>.>..v.>v.v..>v.vv..>vvv.....vv>v>.vvv.>>>..>>.>>>...>vv>v>..v.>....>...vv>
..>.>>.....>...>..v>...>v>...>v.v.>>..>>>.vv>>>...>>>.>vv....>...>..>..v>.>v....vv>.v.vvv...>>.vv>...>>.>.v.v>>>>>.v>>.v.>..v.v.>>..v.v..>v
....v...>>v.v.vv..>vv.v.>....>>...>>>v..>.>vv..vv>>v>.>>>v>...v..v>..>..v.v.vvv....v....>.>.>.vv...v.vvv.>...>.v>.>>...v>>>>vv...v....v...>
v.v.>v..v>>....v.vvv....v...>>.v.>>.>..vv.>.v.>>.v>>v>v>>>..vv>..>..>>>v>.>>v..>..>>.v....v>>.v>...>>.>.>.vv..v>..v.>..>>.>vvv.v...>..v.>.>
>v>>vv.>.>>v>...>>.>..>..vv..>.v.....v>.>...vv.>>...>.>.>>...v..>v......v.>>v>.>..v...v>v.>v....>v>v.>>.v>>>.>..>....vv...v.v.>vv>.v>.vv.>v
v.vv...>v....>.>.v>..>v...vv.....v>>.....v>..>>>.v>.>>vvv.v..>...>v>v>v.>>.....v...vvv>>.v..>>.v>v...v>...v.v..v..>>.>..v.v>...>....v......
>..v>>......>v.v.v.v>v..v..v.>>vv....>v..vv>v...>.v...>v.>>.>v.>..>.v.v.vv>>.>.vv.>>.vv.>v..>>...v>.vv>..v.>vvv..>....>...v..v..v.v>..>>..>
v..>.v....>>...vvv.vv.>.vv>>v.>>v..v...>.>..v.v..v..>..>>...v>...v>.....>>.vvv>....>>.>>.>v>v.......>..>...vv.............v>vv>...v.v.>>..>
.v..>>v.>..>vv.v...v>>>>..>.v..v...v.>>>>v.>>>.>..v>....v....>..v..>.v>..>v.v....>.v..v.v..v...>v>v.>vv.....v.....>...>>.>.v.>vv>>>..v.>>.v
vv...v...vv>.>v...v...v>.v.v.>>..v.>....>...............>vvv.v>v..>>....>.>>...vvv...v.vv..v.v.v...vv.>.v.v>v>>>v......>v..v>>...v>.v>vv>..
.>..v.vv.....>>vv.vv>v..>v>>>.vv>.v.>>>>.v>>.v.v>v..>v..>.>vv>..vv>v>.>vv>v>......>vv.....v.v.>v>.>...v..v.vv...>v..vv.v..>vvv.>.>v>.>v..>.
>.v>v....>...v>>v.vv.v.>..>>>.v.vv.vv.v.>..>>v.>.>......vv.v.>.vv.>v>>..v....vvv>.v.>v...v....vv>.>>>>v.>>>>..v.>v.>v.v.>vv>..vv.v.>.>>.>>v
v.>v>vvv.vv.v..v>v>>.vv..vv.....>.>.>>..v.......>.....>.>.v..>>..>..v>>>.>.>....>>....v.>..>...vv>v..v>v>>vv...>...>>...>...>.v.v.....v>>..
....v>>v.v>>..v>>.>vv.v>>.>vvvv.....v>..>.>..v..>.>..v.>...>>>v..>.>>.>v>>>vvv.........v.vv....v>.>v..>..v.>.v.v>...vv.>...>.v..v>>....>v>>
....>.>..v>v.v>.v..>v.>.>.vv>>v.v>vv..v...>..>>.v>.v>v...v..vv>..v.v..>...v>>>.v..vv>>.>.vvv>>>>.>.>vv.v.>.>.v>v>>.v..v>>>...>vv>>.>..>>.>.
....v......>vvv>v>>>....v>vv>.>.vv>vv.>.vvv>.v..v.....v>>.v..v.v..>...vv>.>.>....>.>.>vv..v...>..v.>.>..v>..>..>.>v...>>.>v..v>v.>>>v>..vv.
>v>.>....>>>.v.v....v.....v...>..>vv.v.>.v>v.>v>v...>>>v.>vvv>.....v>..v.>.>v...vv..v.vv>v..vvv>v...v...>.>..>.v..>>.>>....v....>.v.v.v>>v>
...>..v>>.>>>.v>.>v..>.v>>>v...vv.>v>>v.v>.v.....v.vv...v>vv.vv.>>.>>v...v>.>.>..>.v..>.>v.>>v.>>>v.>.....v.....v..v.v.v>.>v.v...>vv>>>vv>.
.>v.v>.v>.v>.v>>.vv>>.>v>v.....v...v..v..v...>>v.v.>v.>...>..>..v>>.>.>>....vv>...v...v>v..v>v..>>.vv..>v>v>.v...v>>...>>>v.v.vvvvvv>>v.vvv
>vv>.v.>.v..v>vv.vv>>>>.....v.v>..v...v>v>v.>.>>>.>.v>>..>...>..vv>.>..v....v.v>.>..>.v.v......v....>v.>.vv>.vv......v>>...v>....vvv..vvv>v
.v.v...>>v>.>v...vv..v..>>.v..v>v....v..vv..vv..>v...>.>..vv>v.>>v>v..>v.vvv..v>.v>>.v......>..v>>.>>..>v>.v>v..>....v....v.v.>>v>...v.>v..
vv....v>v..>v>.>v>v>..vvvv..>>v..>v.....>.vv....v.>.>.v.v.v...>....>>v...v...v...v.v.v...v..v...vv.v..vv..v.v>>.>vvvv>.v..v.v>.v.>>...vv>v.
.v..vv>...>...>>..v.>.>>>.v>vv>>>vv>>.vvv...>>v..>vvv..v>...v>v.>.vvvv.>v.>...v..v.v.v.....>>.>.v..>v..vv>v.>..>..v>>>v>.v>>...>>>...v..vv>
vv>vv.v>.>..vv.>...v..v...v>>>.vvv..v.>..>>.v>v>..v>.vvv>vv>..>v>>....>....>v>vv>>v>v>v..v...vvv.v.v>.>.v>v.>v.v.>v.vv.>v..>v.v..>>>.v.v>v.
..>.v.v..>..>.>.v.v>..v>..v>.>.>>vv...>vv..v.>v..v.v..v....>.>.>>.........v>vvv.v.v...v........v....>v.>>>.......v>..>>>v>>>.>.v......>..>>
v.>...v.>>.vv.........v.v.>.v..>v..>v>v.vv>....v>vv>.v>v..>v>..vv...>>v.v....v....>.v.....v..v.....>vvvvv.>...v>>>v...v>.v>..>>>>...vvvv>..
vv.>....v>v>>v>..v.>>v>..>..>...>>>v.v>>vv.v..>..vvv.>.....>vv.>>.>>v.v..v>vvv..>...v>>......>..v..v.v>>......>v>.v....>..>v...>......>v>>.
.v.v.>.>>......>vv>>>.v........v>v..>>....>.v..>...v>>vv..v..>.>v...>...v.vv>>.>vv>>v>vvv.>..v.>.>>v..>..v>..>.vvv.v..>.>>>>..v...>v....v>>
.>vv>>>>....>....>..v...vvv.v.vvv.vv.v.....>>v...vvvv.>v.v..>.......v..v>...v.....vvv>.>v...v>v>.>.v.v.>v.vv.v>.>..>.>.......vvv.>>..v>.>..
..v......>>.vv>vv.vv>.v.>>..>v>v>>...vv...>.v...>>.>..vvv>vv.vvv.v...v>v...v...>v.>..>..>v.>v..vv..>..>.>v..v.>...>..>>>...>.........v.>.>v
>vv..>.>..v.>vv.>>>..>..>vvvv.>v>>v..vvv>..>.v..>..v.vv..v>>.>vv.>v.>>v...>..v>.v.>v...v...vv..vvv>>v>.v>.v..>..>>.>.>>.v....v..>>.>...>.>v
v.>>.>>>v.v...v>v.v>....vv>.v>..v.v>.>..v......v>.>....>>..vv....v>...>>>.v......>.vv>>>v>.>vvvvv.v....v>..v>vv>.v>.>...vv.v>vv>v..>>.vv>.v
.v.........v.vv..>..v....>v....>...>v......>...v.v>v..>.v.>...>vv..v...>.>.v>>..v.v>v>.v>>.v......>vv..v>v...v.v.>.>.v>.>v....vvv..>.v.v>.v
..v..v.>>...>.vvv.vv.>....v..>..vv.>v.>>v..v..>.v>v>.v>.v.....>.vv.>.>v.>..v>..v..>v>v..>.>.v..v>.v>..v>...v.>v..>v..>....v...>>>...v..>...
..>.v.>.vv..>v.>>.>.v.v..v>v....>.v.......>.>..>.>.>v>.v..>.>>.>v.>.>v>v..v.>..v>...>..v.>v>>>...>v...........>>...v.vv..v.v.......>v..v.v.
>>v..v..>>v.v..v..v>.v>.vv.v>v..v.>..>v>>v..>>v...v>>vv>...>>>...>...v.v.vv....>.vvv.>.......>.>..>v..v..>.v>...>vv>v...v.>.v..>vv>.>>>v...
vvv.....>.>v.>v>v.v.......>...v..>.vv>>.>>....v...v.vvv...>.vv>>v>.vv..v.v..vv>.>..v.vv>>>...v..>v.v.vv..v.>..>.>...v>....>vvv..>v....vv>..
>v>>>vv.v...v>.vv>...v..>>.>>>v>>v.>vvv..>.v.v>>..v>...>.v.>>.>v........v.vv>v.>.v.>.>v>vv..>>.vv....>...>>>.>>..v>.vvv>>.>.>v...>>v>v.>>v.
>>>>v.>...v...>..vvv.v......>>v.>v.v>.vvv..v>>>.>.>..vv..v..>>..v..>..>v.v.>.>...v>vv..vv.>>......>>>.>.>>v..>>...>.v.....v..>..>>..v>>vv..
..v....>.>v>>...>..>>>......v>.....v..>........>>>>vv.>>v.v..v>.>>>>v..>>....v...v.>.vv.....v....>.v>vv.>....v>vv..v.....v.v>>v..vvv.v.v..v
...>v....v>>.v.vv..>..>>>.v.vv>.>...>vv....v.v>.>>v..>>..>.......v.v.v>..v......>>.....>....>...>.vv>.>.>..>...v>.v.>vv>>>>v..>.vv.v.>>..>>
..>v>v..v.>.v.v.....>v...>vv..v>v.>v>.vvvv>...v.>>.v>.>v>v.>v>..>...>>...v.vv>.>.>...>.>>.v>>>>vv.>vv>>.>.>>v..>.>.>>vv>.>>.>..>v.v.>..>v..
>...v.v.v..v.v>v.>>v>v..>vv>v.>.vv>...v>.....vv>.......>...v>.>...v..vv>.vv.vv>.........>..v>>.v>v.>.>v.v>>v>..>>..>.......>>.>>>.>..v>v>.v
....>..v....vv>....vvv.v.>..v.v>vv..vv...v..vv..vvv...>v>....v.vv.>...v>v....v..>.>>>vv..>....>...v>>>.>vv.>.vv>.v>.>.v....v.vv....>v>.v...
..>.vv.vv.>....>.>>..vv>..v...vv.>>vv>>>.>>>.....vv.....v.....v>>.>>>v>v.v>.>>..v.v...v.v....vv.>..>>...v.>>.v.v.>....>>..>.>>......vv..>>>
v....v>..>>...>.v.v>..>..v>.>.>...........>>..v....vv.v...>v.vv..>>.....>..v.vv...>v..v>v...v.v>>.....>.>..v.>>.v..v.v>v>>>.v......v.v.....
.>..v..>.>..>vv>.v>.vvv.....v..>>>.....v.>v.>v>.>>.>v.>.>vv>.v.....vv.>.v.>...v>.>v...v>.v.vvv>.v...v.v>..v.>v..>...v>v>...>>v....vv...>>vv
v>v....v..>.>v>.v.v.>.v..v..>>vv.v.>...>>.>....v>..>.v>v.>vv>....v..v>.vv.>v.>.v.v....>.v>.vv..>.>..v.v....>.vv...>.v>vv..v>v.v>v..v.>>>vv.
>>...>v.v.>v>>.vv.v.>>v.>>v..>.>vv>.>.>>..>..>...>...>vv..vvv.>v.>vv.v.>.>v..v...vv>..v.>...vv..>v..>.v..>.v.v.....>..v.v.>....>.>v>...v.v>
v>.>>v.......>.>......v...>>.>v>vv....>....v.>vv.>..>.v...>.>v..v>...>>.vv.>.v.vv..v.>v.....vv...>...v.>...v.>..vv>>>>v.>.v.>...v>.>.v>>...
>.>.vv>>>.v>.v....>vv.vv.>...>.>.>.>>.v.>.v...v...>vv...>..vvv....v>.vv..>>..>..v...>>.v.v..>...v...>.>....>>.>..>v>v>.v>>..vv.>v>.>.v..>>.
...>.v.>>.....v...v...vvv...>>.vv>v>.>...v..v>.>.v...>>>.v.>>..vv>.v>vvv....>...v>>.v>.>>>.v.>vv...v.v.>..>>v>v.>....>.....>.>>...>........
.....>..v>vvv>>>v....v>....v.>v..v.v..>..v.....vv..>.>.vv..v..v.....v>.v..>v.v...>.....vv.v.v.>...v.v.v..>..>>....>.>..........v.>>>.v.>v.v
..v.vv>.>v.v>..>vv..vvvvv..>...v....v.....v>>..>...>...>.....vv>.>v.>....v>>..v..v..v.>>.>>.v.>v.vv.>vv>.>>.....>.>>...>..v.>vvv.v....v.v..
>>>>...v...>>v..>>>>v>>>>.vv..v>v.v.>.v.>v..>>v.>>vvvv>v>vv..vv>.>>.v>>>.>>..v.v.vv.>vv>vv.>vv>>.....>.>>.vv....vv.....v..v...>.....vv>.>.>
vv..>...v.v>v>...vvv>.>...v>..vvvv.v.vv>>.....vv>....>vvvv>.>..>.v>.>.>.v>>.>>v..v>v..v.>v>.>...v......vv>.v...vv...>.>v>.>v>v.v>v.vvv.....
.v>vv>..>.v..>>..v..v..v.v>.v>v...>...>....>..>>v.>>.vv>v>.v...>>.v.>..v>.....>v>v>v.v.>>...v.>v.v>.v>v>..>.v>.>vv>.vv>..v>....v.v.>.>..vvv
v..>>.>>>........>...>v...v>..>>....v.>..>...>..v...v.>>.......v..>>v.v..>v..>v>vvv>..>v..>>v>>>....>..v...v.>...v...v>....>v>.>>.>vv...>.v
v>v..>vv.vv...v>...v.v.v.vvv>v>>v>..>..vv...>v...vv...v.>v..v.v..v..>v.v.vv...v.v..>.v>>v>..>>vv.>.v.>v>v>.>>...v>v>..v.>>....v>.v..v.>.v..
.....v.>..>..v>.v...>.....v>..>.v..v.>v>.>v..v..>..>>v...vv.vvvv.>...>vv.v>>v..>v.>.>.>vv..>.v..vv>>..>>v.v.>v.v>>v>..>v.v.v...vv.>..>>.v..
>...>v....>..vvv.>..>>>..v>.>.v...>.v>>..v.>..>..>v.v>.>>...>>>.v..>.v...>.>vvv.v.>v...v>..v.>v.....>.v>.v....v>.........v>v...v.>v......>.
>>.vv>.>...v.v.vv.vvvv...v....>.>.>..>.>>.v..vvv..v.>>>.>>..>v....>.vv>v.vv..v...>>.v>>.>.>vv.>.>v...vv..>.>.v>...>v.v.>v.v.>.>>.....v.>...
.v.v.v...v.v..>..v>..>.v.>....>.>.vv...>>.>..>.>>...v....>>.>........v>v...vv>>>....>.>.>.....v.v....>.>>.>.v.....v....>.v>....>>.>v..>.>..
..v.>..v.v..vvv>.>..>v....>vv>v.......v>vv>>.>>..vvv.>>>v...v>.vv..v.v>..vvv..v.v>..>.v.v>v>...v...>..>>....>....>>..>....vvvv.>..>v...v>vv
.>.v>>>.v.>..v.v...>.>>...>>v>>.>.vv.>>.>...>..>.vvv.....>>.v..........>..>vvvv.>v>.vvv.>v.v..>.>>...vvv.v.>v..>>.v>v>>.v>..vv...>>.....>.v
v...v>.....>.v>.v.v.>>v>.vv.v>>.v...vv.>..>....v.>.>v...>...>.v.v..v>.>>>>vv..>..>.>vv>...v>>v>.>>>.>.>.>>>>v..vv>>vv.v.>...>vvv>..v>.v.vv.
.>>.vv....>vvvvv..>>v.>.>>...v..v..v>v>>.v..vv.v>.v.v>vvvv>.vvv.>v>vvvv...............v.v.>..v.>vvv..v..>...vv>.>..v.......vv...>v.>.>v....
v.v.v.vvv.v..>v.>>v....v>.v>>>v>v...vv>..vv>....v>..>vv.>>vvv.>.vv>..v..v....vv.v>v>v>>...v>>.v.v>..>...v.>.>>.........v.>.v>.>...v.v.v>.>v
v>.v>.....v..>..v.vv.vvvv..v.....v....>.>>.>>v>v.>v.v>..v....v..v..vv.>..vv.v.vv>....>vv.v.>..v..vv>..>v.>.vv.>v>v>.>vv>>..>..v..v...>....>
v......v>..>....>....>>...>......>...v.v.>..>>.>.>>.v.v>.>v>vv...v>..>.vv...>>v..v.....v>>.v....v..>v>vv.......vv...>>>..>>>v..>.v>.>>.>...
..>..>v....v>.vv>v...>>.>v...>>v..>vv.>...>.>.v....>.v.>v..>.v>>...v.v.v>...>....v.v..>v>>>vv...v>vvv..v.v>v>..>>..v>.v..>....v>.>..v.v.>..
vv>>>..>.>v..>>.>..v.>v.>vv..v..v..>v...>.>>v..>>.v>..v.>>.>>.>v.>v.v..>v.>>.v.....v.....v....>.>...v..vv.>..>v...>.v....v.v..v.>.>vv...>.>
v.vv.vv>v>.v.>.....v..vv..v....>v.vv>>..>....v.>.v>>..vv....>v..v>>.>v.>...vv.v>.>..v..v>>..>...v.>.v.v>.>..vvv.>.>.>.vv>vv.v.v..vv..>>>...
.>..vvv....>...v>.>.v..v...>.v>...v.v..v>.>..v..>v..v.vv>..>.>.v>>>.v>.>...v...>>.>.v>.>v.v.>>v..>vv>...>>.>>>>...>.>.>...>...>>>..>.v>v..v
vv..>.v..v.>>..v>>..>..vvv.v..>v>>>...>>.vvv>>v>.>.v.>..>v>vv.v...>>v.>>>>v...>>>.vv.>>.>.>>.v.....v.v>.v>>.v.>vv>>>>.vv..v>..>>..>.>>.v...
>.v>...>...v>>.>>vv>..>.vv..vv>>.>v.>.>....>>>.v>>.v.v.>>.v.>v.>>.>.vvv..........>.>vvv.>>.>.v>vv>v..>.....v..>>..v>.>v>>>v>.v.....v.>.....
.>.v>>.>....v.v>....>>>.>..v>.>..>......>...v..>.vv>.>.v>..v>.vv.v..v...v>>>..>>...>vv.>v>.vv.>vvv....vv.>>>>.>>v...>.>>..v..v>>..>.>>.v.>.
>>..>vv>>.>v.v.>v.>..vv....v>v...vvvvv..vv>v.v..>v.v>>>vv..v.>..v.v.v.v>.v........>.>>vv....v.v..v...vv.>>.v>>>>..v>.>..>>...>..v...>.>..>v
...>....>vv.vvv...v>.v...v>v>v.v.v.vvv.>vv..vvvv.v>...>........vvv.>...v.>.>vv>>.....>vv>.>...v.vv>....>>.v>>vv>>.v.>v......vv>.v>v.v.v.>>>
.vv.>..>v.v.>>.>v.>v..v..>.>..>.v>>v.>v......v...vv..>v>.vv.v>....>vvv....>>...v.vv..v>v....v.v.>>.v.v.>vv..v.>v>.v........v..vv>...vvvv>.v
>.>v.v...>..v.>.>.>..>.....v.>.vvv..>>>....>vv...v>..>v...>..>>.v.>>>v.>.>....>>.v>.>>>>v>v.vvvv.v...v>>.>.....>vvvvv.v>>v.vv....v>.>..v>>>
.>..v.v.>.....>vv>>.>.>v..vv..vv.......v.>v..>>.>v>...v.>.....>....>..v..>>....>.v...>.>.v.>>.....>v....v.v>vvv.>vv.v...>.vv..v.>...v>.v.>v
.v..v>.vv>v....>..v..v.>..>...>>..v>v.v.....>.v>v.v.>>>v>v.>>....>>.>>.>.>>...vv.v.>>..>v...>>vv.v...>..>>.>>.>..>..>..>.>>v.>..>>....v>v>>
.>...>.>..v....>>..>>vvv>..>>>.v.>.>v...>.vv>.>.v>..>....>..v>..v.>>.>>.>>v>.>.v>..>..vv>>..vvv..v..v.vv>>..>.>v.v..>v.........v....>.v>.>>
>.v>.>...vv>...>>v>..v..v..>vv..vv.....v>>>v>.vvv>v>v>.>v..v.v.v..>.v.vv>v....>>......>.>>...>.>>>....>.v...v>..>..v>>>>.>..v.vv.>v..>.vvvv
>.>>.>>>v>vv.v>.v>.v>>>>>....>v.>>>..>.v>vvvv>v>........v.v>v>.v>.vv...v>>....v..>>v.>>>.vv>>.v.>v..>>.vv.vv>...v.>..v...>..v>..>>vv.v.v.v.
.vv>...>.vv.v>>>.>vv>v..>.>>>...>...>>.>.v..v>....v>>>.v.vv.......v>..>vvv>...>..v>>>..vv.v....v.>>v.>..>v>.vv.>>.v.v>v...v>>v.>vv.>..v>>vv
....>...v>v.>..>v>vv>...v.v>.v.v..>.v..>.>>vv..>.v.>.......>.>v>v..>...v...v.v.......>....v>..>.>vv>..vvv>>>v.v>vvv.vvv.v.v>v>>>vv..vv..vvv
.......v>>>.v......v..v>>v.v>..v.vv..>.>.>v.....>v>>>.v>..v..>.>.v..v>....v.>v>........v>...vvv..v.>...v.vv.vvv>...v.v.v.>.v>v>>>>>..v....v
..v.>...vv.vvvvv>>.>.>.>...>>>....>..>.v>>vv...>..>...>v..>.....vv..>v>>.v...v....>v.....v.......v..v...vv>v.>.v>...>v>v.>.>>v>.v.>........
.>..v..vv.>....>>v.......>..v.....v..>.>..>v>.>>..>>.v.v.v.>.v..v.v.v>.>.>.vv>>....v.vv>>..>.v....>..v..>..v>..vv.>.>v.>>..>v.>.v>v>v..v.>.
>..>>.v.v.>v..v.v>.v...>......vv>>v..v.>v...v>.>>>v....>.>>v.v..v..vv.vv.vv.v...>..vvv.>..>>.v.>.v>..>.>>>...v.>..>.....v.>.v>..>....>>v.>.
...v>v...v...v.v>>>..>>...>.>>....>v.v..>vvv..>.vv>>>>.v.vv>v.>>.v.>v.........v.>>.v>>.>v>v..>v....>>...v.....>.>>.....>>>vv>>>.>v.v...>...
..vv....v.>v..v...>>>>v>>...v>...>v.v>.>.v..v>..>..v..v.v>>>.vvv>.>.....vv.v.....vv..v>....v.>v..>>>.vv>...>...>vv>....v>v..>v.vv>..v..vv>v
..>>vv.>v.v..v>.v..>.v>.>.>v...v.v.v.v>.>.v..v>..>vv.v>>>vv>.>v.v>>.>>..>.v.v>v..v>>.>.v.v.>v.>.>..>>vv>.....>v.v...>v.>v.v....v.>>.v>.>.>.
..>...v.>vv>>v..v>......>v....v.vvv.>..>.v>v>..v...v>v.v>>vv>>..v.>..>...>>.>vvv.....>.v.........>v.>>.>..v.>...>>.>.>.>v>v.........v.>v.>>
..>v.v.>>>>...v..>.v>.v>.>v>v..vv.>.>..>..>v..v.....>.v..v>....>v..v..v.>>..>vv.v>v...>v>>>>>.>>v...>.vv....>>v....v.>v....vv..v...vvv..v..
>>>.>v.v.vv>..v>.v>.>.>>.>v.....v..v...v>.>.vvv..>>...>>>v..vv>.>.>.v>.>.....v..v>v.v..>>v.v>vv.>>.vv.>.vv>>.v>..v.v>..>vv...>.....v>>>v..v
...>v.v.>v.v>..v>v..>.>v>>v.vv>.>v.v.>>.>>..>..>v.....v.>v.v..>>vv..v>...>>v....vv..v.>..>.>.v.v.>.>..v.v>>.vvv>v..v...v>>>..v....vv..>..>>
.....vv>>>.>>v>.>>>>>.vv....v..>..v..>>v.v>..>.vv>>..v.v.>..>>.>..>.v...vv>>vv.v.vv.vv...>>vv.>v...v.>>v.>>>>>>..>..>.v>.....vv>v.v....vv..
>vv.vv>vvv..>..v>v>v>v..>>>v>..>>v.>v>v..vv.>v.>>vv.>>>..v.....v...v.>.v>v.v......v.vv....>.vv>...>v...>v.v...>>vv...v>.....>.vv>>>..v>.v.>
v>>.>v...>v>..v.>.v>v..vv>..vvv..>..>..v>vv.....>>v>..>..>..>...vvvv>>....v.>.>vvv.>.v>>>....>v>.>v>v>.............v>..v.v>.v.v.......v.>v.
.vv....v>.vv>vv>..>.>....>...v>>vv.....vv..v.v>.>>.>>....v..v.>>v>>.....v.>v>.....>>...>>>....v.>>..vv>>>>>vv..vv....v>..>v.v..vv.v..v..vvv
>v.>>.v.>.>>v>>...v...v.......vv....vvv.v>.>..vv.v...vv>>.v..>>.>......>..v..vvv>>>v...vv.>...v...>v..>.v...>v>v...>>.>...v..>.v.>vv>....v.
>...>v>....>.>.v.vv>..>.>v..>..v.>v>v>..>v.v..>>vv.>>..v>>>vvvvv.>..v..>v.v..>>vvv..v>...v>>v.>..>.v.>.>...v...>...>.v>.>..vv..vv.>v...v>.v
..>>v.>.>..v.v.v..vvv..v.v>..v.vvv..v>.>v.v..>.....v>.v>..>...vv..v.......v.>v..>.>.>v.>..v.v......>...>v..>v.>>v..v.v..vv......v>>..>>v>..
>.>>v.v>>...v..>vv.>.v>>.v.v>>.v>..>>>..>..>.....vv......>v>.....>vv..v.>v...v>.vv..vv.v>..v.v..v...v>....>...v>>v...>.>>.v>...v>.>>.>v.v.>
..>v..v>>.....>>>..vv>v..v>v>vv.v.>v.>v.>.v.vvv..>.>......v...v...>...>.>.v>>v.>.vv.>..>...vv..>..v..v.vvv..v.vv>vv>>.v....v.v>..v..>....vv
..>v>...v...>.v.v..v.v>..v>>.v>...>.v>....v>v..>>>..v>.v.v>>>>.vv>..>>.>.v.>.v>...>.vvvv..v.v.vvv.>>>>...>v>>.....v..>..>vv.v.vvv>.>..v.>.>
.>..v....v.v>>.>....>>>v.>v>>..>.v.vv.>v..v..>>vv>>..v.v>.vv>>.v.>..>>>v...>...>>>v..v>>>.v..v...v..v..v.v>.v.....vvv>..v...v.>>v>v.>>>vv>.
v..vv.vv.v..v.v..v>..>v.vvvv>.......>v>v..>........>v.>...v..vvv>>.v..v.>....>>vv.v>...>vv>...>..v....v...vvv.>....>....v>>.>.v..>...v>....
v.vv>>>v.v..>v.v>.>>.v.v..>..>>v....v>.vv.>>v..>..>...>.>>..>....>>.>>v....v..v>..>.v..>.v..v..>>.>>>>..>v...v.v>v>v.>v.>..vv.>..>.vv..>.v>
.>>>vv>>.v.vv.v>.vvv.>...v>..>v.>..>vv.>>vvvv.vv.>v>v...v.v>.>>.v.>..vv>.v....v>vv>>>v>v.>..>..vvvvv.>v...>>>v>>.v>.>.>..v>.vvv..vvv.>..v..
.............v>v>....vv.v.>.v.>>...v.>>...>.v>.v>v>>...>>...v.v..v>v>...v..>v>..v....>.v..v>..vv.>>.>..vv>..v>v..vvv....v.>vvv..v.....>v>.>
.v...>..v>..v>>.v.>.vv..v.>>...v>..v.>...>>vv>vv>..>..v..v>>.>v.v.>vv>.>v.v>..v.>v>..v..>...v....>v.>vv>v>..vvvv>....v>.>v.>..>>v.v.v.v>>v.
>...>.>.........>vv......v..>v.>v>>.>..>.v..>>...v.v>v..>>..>vv>...vv>.v.>v...>...>vvv>..v..v.v..v....>....>v>..>v.>..>..>>>....>vvvvv..v..
vv>>...>>.v>>>v..>.vv.>>>>.>.v>v>vv>..>.>vv>>v..v.>......vv.v.v..>..>...>..v>>v.v.v>...>>>v>...>>v..v>.v..v.>>>vv.>>vv...>>........>vv....v
....vv>.....vv.v>.vv.vvv>vv....>>>.v...v>v........>..>....>>.v>..>v>>.v..v..>.vv.>.v.v>>>>..>>.>.>.>.>.vv..>v>.v>...vv.>>v>v.>>.v>v>vv>>>..
>.v.>...v.>>>..>vv..>.v.vvvv.v>v.>>.>....>>.>>v.....>.v>....v..v.>>>....vvv>.v>...v>>.>v...>v..>..vvv>.v.v.vv>v.v..>v>..>.>..>..vvv.v.vv>v.
v>...v..>>>v..v.>..>..v.>.>.vvv.v.>>.v>v..>.v>.v..>>>.vvv.>v..vvv..v.>.vv>.......>.>..>.v.vv>....vv>..>>.vv..v>v.>.v>>..v.vv>..vv.vv.....>>
vvv.>>v>>v..>>....vv.vv.vv.....v..>.>..v>>......vv.>v.>>vv...>v.......v.>>v.v..v...>..vvv....vvv...>..>vv.....v.v>.>..>v...>v.>.v.vvv...>>>
.>v.>..vvv.>>..>.v.....>.>vv>.vvv..v.v.....>>.>....>>vv.vvv>>...v....v..v>.....>.vv>vvv...>.>v>>>..>......vv...>>...>>.v.....>.v>>vv>.v>>.v
>v.v.vv>v>v..>>v.v....v>>>.>...>v.v>v.v.vv>.v>.vv..>.>..v.......>.v>v.vvvv..vv.>>.vv.vvv...v..>...>....>v..>>>..>....>..v..v>..v..vvv..v...
>.vv.v>v.v>..v..v.........>.....>...>v>.v>>.v>>...>..vv.>>.>vv.v.v.....>.v...>vv>>v......>.>.>v>...>.....>>..v......v.vv>vv>v>...v>v>....vv
v>>vv.v>.>>v.>v>...>.>..v.vv..>>..v.v..>v>.v>.v.v..>...>...>>..v>>>v.>.......vv.>v.>>.>>......v..>>.>..>>...v>>>v.>v.v.>vvv....>vvv>>..>...
>v>..v>......v..vvv.....>.>>v..v..v....>>.vvvv.>>v>vvv.v.v.v>>>v.>v.>>.v....v.>>.>..>..v.....v>.vv....v.>v.v>..v.....v.vv.>>vv>...vv.>>.>.v
.v.>.v......v....v>v.>.>v.v>.>.v...v...>.vv..v.vv..v.v..v..v...>.>>.vv.v.>vv.....v..v.>>.>.v.....>.>.v.v>.>v>.>>>..>.>...v>.>>.>>..>>.v.v.>
..vvv.v..>>..>v...>vv...>>.v.>>v...>>..>.>>..>vv>..>.>>..>..>..>>>....>.>.>vv.vv...v.v.....v>v..>.>...vv>>>>v>vvv............>v..>v.v.>.>v>
......>..vv.....>>.>..vv.>vv...v.v...v>v.>.>v>.>v..>.>..vv.>.......>v....v..>....>v..v.vv.>.v.vv..v.v.>.v....>v.vv....>..>vvvv...>>.>.vv...
>...>>>vv...v.v.v...>>vv.>v.>.>v>.>v..>>..v..v..>..>.>..v>.vv>...v..vv>>vv..>..>>v.>..v.>..v>..>.....>.vv>..>>>.>.>vvv.vv.......vv>vv>.>.v>
vv.vvv..v...>vv...v.vvv.>v...vvv....>v>.vvv>v>..v..>.>>>>>.vvv..>...>..>.>..>v>.....v.....v.v>>>>.>vv.v..>>>.>>.v>..>..>....>..v.>>.>>.>.>.
`.trim();

const input2 = `
v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`.trim();

const input = input1;

interface GridProps extends MeshProps {
  state: State | null;
}

const realSolver = new Day25(input);

const tempObject = new Object3D();
const colors = {
  '>': new Color('orange'),
  'v': new Color('blue'),
  '.': new Color('black'),
} as const;

const Grid = ({ state }: GridProps) => {
  const height = !state ? 0 : state.floor.length;
  const width = !state ? 0 : state.floor[0].length;
  const maxSize = width * height;

  const { invalidate, camera } = useThree();
  const instance = useRef<InstancedMesh>();
  const colorArray = useMemo(() => Float32Array.from(new Array(maxSize).fill(colors['.'])), [])

  useLayoutEffect(() => {
    let i = 0;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const id = i++
        tempObject.position.set(x + 0.5, -y + 0.5, -1);
        tempObject.updateMatrix()
        instance.current!.setMatrixAt(id, tempObject.matrix)
      }
    }
    instance.current!.instanceMatrix.needsUpdate = true
  }, [maxSize]);

  useLayoutEffect(() => {
    if (!state) { return; }
    let i = 0;
    for (let x = 0; x < width; x += 1) {
        for (let y = 0; y < height; y += 1) {
        const spot = state.floor[y][x];
        instance.current!.setColorAt(i, colors[spot]);
        i += 1;
      }
    }
    instance.current!.instanceColor!.needsUpdate = true;
    invalidate();
  }, [state]);

  if (!state) { return null; }

  return (
    <>
      <ambientLight />
      <Camera.Orthographic width={width} height={height} />
      <instancedMesh ref={instance} args={[undefined, undefined, width * height]}>
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]}>
          <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 1]} />
        </boxBufferGeometry>
      </instancedMesh>
      <GridHelper width={width} height={height} />
    </>
  );
}

const Year2021: NextPage = () => (
  <>
    <Head>
      <title key="title">2021 - 25</title>
    </Head>

    <h2>--- Year 2021: Day 25 ---</h2>

    <ReplayWithThree solveClass={realSolver} render={Grid} />
  </>
);

export default Year2021;
