import { findFalsyKeys } from "@/lib/utils"

export const env = {
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
}
//load all env if not exist  throw error
const missingKeys = findFalsyKeys(env)
if (missingKeys.length > 0) {
    throw new Error("Missing keys " + missingKeys)
}
