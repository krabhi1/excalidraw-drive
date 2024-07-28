import { faker } from "@faker-js/faker";
import { getAccessTokenCookies, getTokenCookies, randomValue, setAccessTokenCookies } from "../others/utils";
import { apiCall, demoApi, serverApiCall } from "./common";


export async function getAccessToken(code: string) {
    const result = await serverApiCall<{
        google_access_token: string;
        token: string;
    }>({
        path: "/tokens",
        query: {
            code
        },
        method: 'GET'
    })
    return result
}
export async function refreshAccessToken() {
    const result = await serverApiCall<{ google_access_token: string }>({
        path: "/google/refresh/access_token",
        authToken: getTokenCookies()!,
        method: 'GET'
    })
    if (result.result) {
        setAccessTokenCookies(result.result.google_access_token)
    }
    return result.result ? true : false
}