import { Err, Ok } from "ts-results-es";

export type Env = {
  JWT_SECRET: string;
  NODE_ENV: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  MONGODB_URI: string;
};
export function getEnv() {
  const env: Env = {
    JWT_SECRET: process.env.JWT_SECRET!,
    NODE_ENV: process.env.NODE_ENV!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI!,
    MONGODB_URI: process.env.USERS_TABLE!,
  };

  //if any invalid return undefined
  if (Object.values(env).some((v) => !v))
    return Err("some env variables are missing");
  return Ok(env);
}
