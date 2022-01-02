import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Home: NextPage = () => (
  <>
    <Head>
      <title key="title">2021</title>
    </Head>

    <h2>--- Years ---</h2>

    <ul>
      <li><Link href="/2021">2021</Link></li>
    </ul>
  </>
);

export default Home
