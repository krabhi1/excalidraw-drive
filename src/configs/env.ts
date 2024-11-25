import { findFalsyKeys } from "@/lib/utils"

export const env = {
    firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    firebaseMeasurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    firebaseMessagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
}
//load all env if not exist  throw error
const missingKeys = findFalsyKeys(env)
if (missingKeys.length > 0) {
    throw new Error("Missing keys " + missingKeys)
}
