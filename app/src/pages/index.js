import Head from 'next/head';

import styles from '@/styles/Home.module.css';

import dynamic from 'next/dynamic';

import { initializeApp } from 'firebase/app';
import { ref, getDatabase } from 'firebase/database';
import { useListVals } from 'react-firebase-hooks/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "clouds-watch.firebaseapp.com",
  projectId: "clouds-watch",
  databaseURL: 'https://clouds-watch-default-rtdb.firebaseio.com/',
  storageBucket: "clouds-watch.appspot.com",
  messagingSenderId: "613527026195",
  appId: "1:613527026195:web:918ec1d042432cc6bb9de6"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
 
const Sky = dynamic(() => import('../components/Sky'), {
  loading: () => <p>loading...</p>,
  ssr: false,
});

export default function Home() {

  const [clouds, loading, error] = useListVals(ref(database, 'clouds'));

  return (
    <>
      <Head>
        <title>clouds.watch</title>
        <meta name="description" content="watch clouds" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {error && <strong>Error: {error}</strong>}
      {loading && <strong>Loading...</strong>}
      {!loading && clouds && (
        <Sky clouds={clouds} />
      )}
    </>
  );
}
