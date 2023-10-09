import { faker } from "@faker-js/faker";
import { RequestQuery, Result } from "../interfaces";
import { getAccessTokenCookies, randomValue, setAccessTokenCookies } from "../others/utils";
import { refreshAccessToken } from "./token";
const server_url = import.meta.env.VITE_SERVER_URL
function objectToQueryString(obj: { [key: string]: any }): string {
    const parts: string[] = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            parts.push(`${key}=${value}`);
        }
    }
    return parts.join('&');
}


export async function apiCall<T>(query: RequestQuery) {
    try {
        const { path, method = "GET", headers = {}, query: params = {}, body, authToken } = query;
        // Construct the URL with query parameters
        let url = path || "";
        // if (Object.keys(params).length > 0) {
        //     const queryParams = new URLSearchParams(params);
        //     url += `?${queryParams.toString()}`;
        // }
        url += "?" + objectToQueryString(params)

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        const requestOptions: RequestInit = {
            method,
            headers: {
                ...headers,
            },
            redirect: 'follow'
        };
        if (body) {
            requestOptions.body = typeof body == 'object' ? JSON.stringify(body) : body
        }
        const response = await fetch(url, requestOptions);
        let result: Result<T> = {
            errorMessage: "",
            statusCode: response.status,
        };
        if (response.ok) {
            if (query.onSuccess) {
                result = await query.onSuccess(response, result)
            }
            else {
                result.result = await response.json()
            }
        } else {
            if (query.onFail) {
                result = await query.onFail(response, result)
            }
            else {
                result = await response.json()
            }
        }
        return result;
    } catch (error: any) {
        return {
            result: undefined,
            errorMessage: error.message,
            error,
            statusCode: 500,
        };
    }
}

export async function serverApiCall<T>(query: RequestQuery) {
    query.path = server_url + query.path
    return apiCall<T>({
        async onSuccess(res, result) {
            return await res.json()
        },
        async onFail(res, result) {
            return  await res.json()
        },
        ...query
    })
}
export async function authSafeServerApiCall<T>(query: RequestQuery) {
    query.path = server_url + query.path
    query.authToken = getAccessTokenCookies()!
    return authSafeApiCall<T>(query)
}
export async function googleApiCall<T>(query: RequestQuery) {
    query.path = "https://www.googleapis.com" + query.path
    query.authToken = getAccessTokenCookies()!
    return authSafeApiCall<T>({
        async onSuccess(res, result) {
            result.result = await res.json()
            return result
        },
        async onFail(res, result) {
            result.error = await res.json()
            return result
        },
        ...query
    })
}
export async function authSafeApiCall<T>(query: RequestQuery) {

    const result = await apiCall<T>(query)
    if (result.statusCode == 401) {
        //token is expires need one
        const tokenResult = await refreshAccessToken();
        if (!tokenResult) {
            //redirect to login route
            window.location.href = '/login';

        }
        query.authToken = getAccessTokenCookies()!
        return apiCall<T>(query)
    }
    return result
}


export async function demoApi<T>(result: T) {
    const success: Result<T> = {
        result: result,
        statusCode: 200,
        errorMessage: ''
    }
    const fail: Result<undefined> = {
        result: undefined,
        statusCode: 400,
        errorMessage: 'some error'
    }
    return randomValue(success, fail)
}