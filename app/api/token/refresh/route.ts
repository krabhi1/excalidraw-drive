export const dynamic = "force-dynamic"; // static by default, unless reading the request
import {} from "../../config";
export function GET(request: Request) {
  return new Response(`api/routes/refresh`);
}
