import { None, Option, Some, Result, Ok, Err } from "ts-results-es";
import { Env, getEnv } from "./config";
type HttpResultType<T> =
  | Ok<{
      data: T;
      status: number;
    }>
  | Err<{
      message: string;
      status: number;
    }>;

export function makeJsonResponse(result: HttpResultType<any>) {
  if (result.isOk()) {
    return new Response(JSON.stringify(result.value), {
      headers: {
        "Content-Type": "application/json",
      },
      status: result.value.status,
    });
  }
  return new Response(JSON.stringify(result.error), {
    headers: {
      "Content-Type": "application/json",
    },
    status: result.error.status,
  });
}

export async function parseBodyToJson<T>(req: Request) {
  try {
    const body = await req.json();
    return body as Promise<T>;
  } catch (e) {
    // console.error(e);
    return {} as Promise<T>;
  }
}

export type CustomRequest = {
  native: Request;
  body: any;
  params: any;
  env: Env;
  headers: any;
};

export async function handleRoute(
  request: Request,
  callback: (req: CustomRequest) => Promise<Response>,
) {
  const body = await parseBodyToJson(request);
  const env = getEnv();
  if (env.isOk()) {
    const urlParams = new URL(request.url).searchParams;
    const params = Object.fromEntries(urlParams.entries());
    return callback({
      native: request,
      body: body,
      params: params,
      env: env.value,
      headers: request.headers,
    });
  }
  return makeJsonResponse(Err({ message: env.error, status: 500 }));
}

type FetchParams = {
  url: string;
  method: "POST" | "GET" | "PATCH" | "DELETE" | "PUT";
  headers?: any;
  body?: any;
};

export async function jsonFetch<T = any>({
  url,
  method,
  headers,
  body,
}: FetchParams) {
  try {
    const jsonHeaders =
      typeof body === "object" ? { "Content-Type": "application/json" } : {};
    const response = await fetch(url, {
      method,
      headers: headers || jsonHeaders,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-cache",
    });

    try {
      const data = (await response.json()) as T;
      return Ok({ data, status: response.status });
    } catch (e) {
      console.log(e);
      return Err({ message: "ParseError: response is not JSON", status: 500 });
    }
  } catch (e: any) {
    console.log(e);
    return Err({ message: "FetchError: " + e.message || "", status: 500 });
  }
}
