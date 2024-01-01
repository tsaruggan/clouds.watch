import Head from 'next/head'

import styles from '@/styles/Home.module.css'

import dynamic from 'next/dynamic'

import React, { useState, useEffect } from 'react';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
 
const Sky = dynamic(() => import('../components/Sky'), {
  loading: () => <p>loading...</p>,
  ssr: false,
});

export default function Home() {
  const [clouds, setClouds] = useState([]);

  useEffect(() => {
    var config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: "clouds-watch.firebaseapp.com",
      projectId: "clouds-watch",
      databaseURL: 'https://clouds-watch-default-rtdb.firebaseio.com/',
      storageBucket: "clouds-watch.appspot.com",
      messagingSenderId: "613527026195",
      appId: "1:613527026195:web:918ec1d042432cc6bb9de6"
    };
    const app = initializeApp(config);
    const db = getDatabase(app);
    const cloudsRef = ref(db, 'clouds');
    onValue(cloudsRef, (data) => {
      const firebaseData = data.val();
      const cloudsData = Object.keys(firebaseData).map(key => {
        const cloud = firebaseData[key];
        return {
          name: cloud.name, 
          drawing: cloud.drawing, 
          boundingBox: cloud.boundingBox, 
        } 
      });
      setClouds(cloudsData);
    }, (err) => {
      console.log(err);
    }); 

  }, []);

  return (
    <>
      <Head>
        <title>clouds.watch</title>
        <meta name="description" content="watch clouds" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sky clouds={clouds} />
    </>
  )
}
