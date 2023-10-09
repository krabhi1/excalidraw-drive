import { faker } from "@faker-js/faker";
import { Result, UserProfile } from "../interfaces";
import { getAccessTokenCookies, randomFileInfo } from "../others/utils";
import { apiCall, demoApi, googleApiCall, serverApiCall } from "./common";

//get userProfile
export async function getUserProfile() {

    let { result, ...others } = await googleApiCall<any>({
        path: '/oauth2/v3/userinfo'
    })

    let newResult: Result<UserProfile | undefined> = {
        ...others
    }
    if (result) {
        const { email, name, picture: imageURL } = result
        newResult.result = {
            email, name, imageURL
        }
    }

    return newResult
}

