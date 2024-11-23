import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { env } from "./env";

// Initialize Firebase
const app = initializeApp({
    apiKey: env.firebaseApiKey,
    appId: env.firebaseAppId,
    authDomain: env.firebaseAuthDomain,
    measurementId: env.firebaseMeasurementId,
    messagingSenderId: env.firebaseMessagingSenderId,
    projectId: env.firebaseProjectId,
    storageBucket: env.firebaseStorageBucket,

});
const auth = getAuth(app);

function logOut() {
    return signOut(auth)
}

export { app, auth, logOut };