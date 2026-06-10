import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA9mTTubBboHDofP0zsvCuiczfXn4VIoBg",
  authDomain: "weather-dashboard-bf169.firebaseapp.com",
  databaseURL: "https://weather-dashboard-bf169-default-rtdb.firebaseio.com",
  projectId: "weather-dashboard-bf169",
  storageBucket: "weather-dashboard-bf169.firebasestorage.app",
  messagingSenderId: "950661619801",
  appId: "1:950661619801:web:5e06f9071e7cd7ee1fd148",
  measurementId: "G-38RWY73PB9"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export default app;