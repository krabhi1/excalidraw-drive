import { makeJsonResponse } from "../utils";

export const dynamic = "force-dynamic"; // static by default, unless reading the request
export function GET(request: Request) {
  return makeJsonResponse({})
}
