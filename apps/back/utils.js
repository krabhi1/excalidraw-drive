import jwt from 'jsonwebtoken';


export function extractTokenFromHeader(request) {
    const [type, token] = request.get('Authorization')?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
}


export function generateJWT(payload, secret, expiresIn = '1h') {
    return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJWT(token, secret) {
    try {
        const decoded = jwt.verify(token, secret)
        return decoded;
    } catch (error) {
        console.log(error)
        // If the token is invalid or has expired, an error will be thrown
        return null;
    }
}

function objectToQueryString(obj) {
    const parts = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            parts.push(`${key}=${value}`);
        }
    }
    return parts.join('&');
}


export async function apiCall(query) {
    try {
        const { path, method = "GET", headers = {}, params = {}, body, authToken } = query;
        console.log({ path })
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
        const requestOptions = {
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
        let result = {
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
        console.log(result)
        return result;
    } catch (error) {
        console.log(error)
        return {
            result: undefined,
            errorMessage: error.message,
            error,
            statusCode: 500,
        }
    }
}
export async function googleApiCall(query) {
    return apiCall(query)
}