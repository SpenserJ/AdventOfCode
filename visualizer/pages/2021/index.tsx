import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';

const Year2021: NextPage = () => (
  <>
    <Head>
      <title key="title">2021</title>
    </Head>

    <h2>--- Year 2021 ---</h2>

    <ul>
      <li><Link href="/2021/17">Day 17</Link></li>
      <li><Link href="/2021/20">Day 20</Link></li>
      <li><Link href="/2021/23">Day 23</Link></li>
      <li><Link href="/2021/25">Day 25</Link></li>
    </ul>
  </>
);

export default Year2021;
