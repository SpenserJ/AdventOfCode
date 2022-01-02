import Head from 'next/head'
import type { AppProps } from 'next/app'
import Link from 'next/link'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 8px;
    font-family: "Source Code Pro", monospace;
    font-size: 14pt;
    background: #0f0f23;
    color: #cccccc;
  }

  h1, h2 {
    font-size: 1em;
    font-weight: normal;
  }

  a {
    text-decoration: none;
    color: #009900;
  }
`;

const theme = {
  /*
  colors: {
    primary: '#0070f3',
  },
  */
};

const Header = styled.header`
  color: #00cc00;

  & h1 {
    display: inline-block;
    margin: 0;
    padding-right: 1em;
    text-decoration: none;
    color: #00cc00;
    text-shadow: 0 0 2px #00cc00, 0 0 5px #00cc00;
  }

  & nav {
    display: inline-block;

    & ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
      display: inline-block;
    }

    & li {
      display: inline-block;
      padding: 0 0.6em;
    }

    & a {
      display: inline-block;
      outline: none;
    }
  }
`;

const Main = styled.main`
  margin-bottom: 2em;
  margin-top: 2em;
`;

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title key="title">SpenserJ - Advent of Code</title>
      <meta key="description" name="description" content="Advent of Code solutions and visualizations" />
      <link rel="icon" href="/favicon.ico" />
      <link href="//fonts.googleapis.com/css?family=Source+Code+Pro:300&amp;subset=latin,latin-ext" rel="stylesheet" />
    </Head>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <Header>
        <h1><Link href="/">Advent of Code</Link></h1>
        <nav>
          <ul>
            <li><Link href="/2021">[2021]</Link></li>
          </ul>
        </nav>
      </Header>
      <Main>
        <Component {...pageProps} />
      </Main>
    </ThemeProvider>
  </>
);

export default MyApp
