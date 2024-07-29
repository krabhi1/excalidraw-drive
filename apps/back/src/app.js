import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET } from "./config.js";
import { findUserByEmail, upsertUser } from "./database.js";
import { getGoogleTokens, getNewGoogleAccessToken, getUserProfile } from "./google.js"
import { generateJWT } from "./utils.js";


export async function getTokens(code) {
    let result = {
        errorMessage: '',
        statusCode: 400
    }
    const googleTokens = await getGoogleTokens(code);
    console.log({ googleTokens })
    if (googleTokens.result) {

        const profile = await getUserProfile(googleTokens.result.access_token)
        console.log({ profile })
        if (profile.result) {

            //save email and refresh token or update refresh token if email exist
            let refreshToken = undefined
            if (googleTokens.result.refresh_token) {
                refreshToken = googleTokens.result.refresh_token
            }
            else {
                //load from database
                const user = await findUserByEmail(profile.result.email)
                if (user) {
                    refreshToken = user.refreshToken
                } else {
                    return { ...result, errorMessage: "user not found with email " + profile.result.email }
                }
            }
            await upsertUser(profile.result.email, refreshToken)
            result.statusCode = profile.statusCode
            const token = generateJWT({
                google_access_token: googleTokens.result.access_token,
                email: profile.result.email
            }, JWT_SECRET)
            result.result = { token, google_access_token: googleTokens.result.access_token }
            result.statusCode = 200
        } else {
            result = { ...result, ...profile, errorMessage: "cannot fetch profile" }
        }
    } else {
        result = { ...result, ...googleTokens, errorMessage: "cannot fetch getGoogleTokens" }
    }
    return result
}
export async function getNewGoogleAccessTokenByEmail(email) {
    const user = await findUserByEmail(email)
    let result = {
        errorMessage: '',
        statusCode: 400
    }
    const tokenResult = await getNewGoogleAccessToken(user.refreshToken)
    if (tokenResult.result) {
        result.result = {
            google_access_token: tokenResult.result.access_token
        }
        result.statusCode = 200
    } else {
        console.log({ tokenResult })
        result = { ...result, ...tokenResult, errorMessage: "cannot fetch getNewGoogleAccessToken" }
    }
    return result
}
async function test() {
    const email = "abhi@gmail.com"
    const code = "4/0AeaYSHCZSLF8mQ9myghKHFqvLH9Qev9rrmGaRSA9DnROa_Lc6mvZoUSxVB_Aj1FC2zkboA"
    const refreshToken = "1//0gfJtKLchQb1lCgYIARAAGBASNwF-L9IrLY_mWCuKKdx5cu7-78t396CO8shHjiIyjPEkBDbBayK-QnrxHovBIl8FNxECoMX-kHM"
    const result = await getTokens(code)
    // const result = await getNewGoogleAccessToken(refreshToken)
    // const result = await getNewGoogleAccessTokenByEmail(email)
    console.log({ result })
}
// test()