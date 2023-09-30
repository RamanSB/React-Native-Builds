import AsyncStorage from "@react-native-async-storage/async-storage";
import * as firebaseApp from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import * as firebaseFireStore from "firebase/firestore";

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

// TODO: Incorporate Doppler to hide the API Key.
const firebaseConfig = {
  authDomain: "signal-clone-66365.firebaseapp.com",
  projectId: "signal-clone-66365",
  storageBucket: "signal-clone-66365.appspot.com",
  messagingSenderId: "79395730025",
  appId: "1:79395730025:web:abcf3322e09b74db52a8f8",
  measurementId: "G-KM2N62CP31",
};

let app;

if (firebaseApp.getApps().length === 0) {
  app = firebaseApp.initializeApp(firebaseConfig);
} else {
  app = firebaseApp.getApps()[0];
}

const db: firebaseFireStore.Firestore = firebaseFireStore.initializeFirestore(
  app,
  {}
);

const auth: firebaseAuth.Auth = firebaseAuth.initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});

export { db, auth };
