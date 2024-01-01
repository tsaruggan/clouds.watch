import Head from 'next/head'

import styles from '@/styles/Home.module.css'

import dynamic from 'next/dynamic'
 
const Sky = dynamic(() => import('../components/Sky'), {
  loading: () => <p>loading...</p>,
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>clouds.watch</title>
        <meta name="description" content="watch clouds" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sky />
    </>
  )
}
