import { Ok } from "ts-results-es";
import { makeJsonResponse } from "../utils";
import { getAllUsers } from "../database";

export const dynamic = "force-dynamic"; // static by default, unless reading the request
export async function GET(request: Request) {
  return makeJsonResponse(Ok({ data: await getAllUsers(), status: 200 }));
}