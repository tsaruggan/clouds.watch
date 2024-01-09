import Head from 'next/head';

import styles from '@/styles/Home.module.css';

import dynamic from 'next/dynamic';

import { initializeApp } from 'firebase/app';
import { ref, getDatabase, push } from 'firebase/database';
import { useListVals } from 'react-firebase-hooks/database';
import { useEffect, useState } from 'react';

import { cloneDeep } from "lodash";

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

var Sky = dynamic(() => import('../components/Sky'), {
  loading: () => <p>loading sky...</p>,
  ssr: false,
});

var Draw = dynamic(() => import('../components/Draw'), {
  loading: () => <p>loading draw...</p>,
  ssr: false,
});


export default function Home() {

  const [clouds, loading, error] = useListVals(ref(database, 'clouds'));
  const [drawVisible, setDrawVisible] = useState(true);
  const [name, setName] = useState('');
  const [drawing, setDrawing] = useState([]);

  useEffect(() => {
    Sky = dynamic(() => import('../components/Sky'), {
      loading: () => <p>loading sky...</p>,
      ssr: false,
    });

    Draw = dynamic(() => import('../components/Draw'), {
      loading: () => <p>loading draw...</p>,
      ssr: false,
    });
  });

  const display = () => {
    if (drawVisible) {
      return <Draw 
              toggleDrawVisible={toggleDrawVisible} 
              name={name} 
              onNameInputChange={onNameInputChange} 
              drawing={drawing}
              updateDrawing={updateDrawing}
              clearDrawing={clearDrawing}
              submitDrawing={submitDrawing}
            />
    } else {
      return <Sky 
              clouds={clouds} 
              toggleDrawVisible={toggleDrawVisible} 
              />
    }
  }

  const toggleDrawVisible = () => {
    setDrawVisible(!drawVisible);
  }

  const onNameInputChange = (e) => {
    setName(e.target.value);
  }

  const updateDrawing = (path) => {
    if (path != undefined && path.length > 0) {
      const newDrawing = drawing;
      newDrawing.push(path);
      setDrawing(newDrawing);
    }
  }

  const clearDrawing = () => {
    setDrawing([]);
  }

  const submitDrawing = () => {
    const [boundedDrawing, boundingBox] = boundDrawing(drawing);
    const cloud = {
      name: name,
      drawing: boundedDrawing,
      boundingBox: boundingBox
    };
    push(ref(database, 'clouds'), cloud);
    clearDrawing();
    toggleDrawVisible();
  }

  const boundDrawing = (drawing) => {
    let minX = 640;
    let minY = 420;
    let maxX = 0;
    let maxY = 0;
    for (var i = 0; i < drawing.length; i++) {
        let path = drawing[i];
        for (var j = 0; j < path.length; j++) {
            let point = path[j];
            let x = point.x;
            let y = point.y;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        }
    }
    let boxWidth = maxX - minX;
    let boxHeight = maxY - minY;

    let drawingCopy = cloneDeep(drawing);
    for (var i = 0; i < drawingCopy.length; i++) {
        var path = drawingCopy[i];
        for (var j = 0; j < path.length; j++) {
            let point = path[j];
            let x = point.x;
            let y = point.y;
            path[j].x  =  x - minX;
            path[j].y  =  y - minY;
        }
    }
    return [drawingCopy, {width: boxWidth, height: boxHeight}];
  }

  return (
    <>
      <Head>
        <title>clouds.watch</title>
        <meta name="description" content="watch clouds" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {error && <strong>error: {error}</strong>}
      {loading && <strong>loading...</strong>}
      {!loading && clouds && (
        display()
      )}
    </>
  );
}
