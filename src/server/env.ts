export const env = {
  authSecret: process.env.AUTH_SECRET!,
  authTrustHost: process.env.AUTH_TRUST_HOST, // Convert to boolean
  authGoogleSecret: process.env.AUTH_GOOGLE_SECRET!,
  authGoogleId: process.env.AUTH_GOOGLE_ID!,
};
