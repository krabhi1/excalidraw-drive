import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from './config.js'
import { googleApiCall } from './utils.js'
export async function getGoogleTokens(code) {
    const params = {
        code: code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
    }
    console.log({ params })
    const result = await googleApiCall({
        method: 'POST',
        path: "https://oauth2.googleapis.com/token",
        params
    })
    return result
}
export async function getNewGoogleAccessToken(refresh_token) {
    const result = await googleApiCall({
        method: 'POST',
        path: "https://oauth2.googleapis.com/token",
        params: {
            refresh_token,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            // redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: 'refresh_token'
        }
    })
    console.log({ refresh_token }, { result })
    return result
}
export async function getUserProfile(auth) {

    const result = await googleApiCall({
        method: 'GET',
        path: "https://www.googleapis.com/oauth2/v3/userinfo",
        authToken: auth
    })

    return result
}


async function test() {
    const code = "4/0AeaYSHDgaPytLUxmKwywkv9b_4_2yESfwmnZV9QUq5xCye7Z-gevTU_7Oz8oFw2TtiF2aQ"
    const result = await getGoogleTokens(code)
    console.log({ result })
}
// test()