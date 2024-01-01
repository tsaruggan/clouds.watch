import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "clouds-watch.firebaseapp.com",
    projectId: "clouds-watch",
    databaseURL: 'https://clouds-watch-default-rtdb.firebaseio.com/',
    storageBucket: "clouds-watch.appspot.com",
    messagingSenderId: "613527026195",
    appId: "1:613527026195:web:918ec1d042432cc6bb9de6"
};

export async function getData(callback) {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const cloudsRef = ref(db, 'clouds');

    onValue(cloudsRef, (data) => {
        const firebaseData = data.val();
        const clouds = Object.keys(firebaseData).map(key => {
          const cloud = firebaseData[key];
          return {
            name: cloud.name, 
            drawing: cloud.drawing, 
            boundingBox: cloud.boundingBox 
          } 
        });
        callback(clouds);
    }, (err) => {
        console.log(err);
    });
}