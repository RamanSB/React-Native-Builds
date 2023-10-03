import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { initializeAuth, Auth } from "firebase/auth";
// import { FIREBASE_API_KEY } from "@env";

// Had to be done, although this is not a modular approach, I needed this to get access to
// getReactNativePersistence.
import * as firebaseAuth from "firebase/auth";
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

const firebaseConfig = {
  apiKey: "AIzaSyCz06YNAryp-YExTYDRpGePAbBvhElPYNc",
  authDomain: "signal-clone-66365.firebaseapp.com",
  projectId: "signal-clone-66365",
  storageBucket: "signal-clone-66365.appspot.com",
  messagingSenderId: "79395730025",
  appId: "1:79395730025:web:abcf3322e09b74db52a8f8",
  measurementId: "G-KM2N62CP31",
};

let app;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db: Firestore = getFirestore(app);

const auth: Auth = initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});

export { db, auth };
