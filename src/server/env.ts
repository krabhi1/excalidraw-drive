import { z } from "zod";

export const parsedEnv = {
  authSecret: process.env.AUTH_SECRET!,
  authTrustHost: process.env.AUTH_TRUST_HOST, // Convert to boolean
  authGoogleSecret: process.env.AUTH_GOOGLE_SECRET!,
  authGoogleId: process.env.AUTH_GOOGLE_ID!,
};

const envSchema = z.object({
  authSecret: z.string().min(1, "AUTH_SECRET must be set"),
  authTrustHost: z.boolean().default(false),
  authGoogleSecret: z.string().min(1, "AUTH_GOOGLE_SECRET must be set"),
  authGoogleId: z.string().min(1, "AUTH_GOOGLE_ID must be set"),
});

const result = envSchema.safeParse(parsedEnv);

if (!result.success) {
  console.error(
    "Environment variables validation failed:",
    result.error.format()
  );
  throw new Error("Invalid environment variables");
}
const env = result.data;
export { env };
