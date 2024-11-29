import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { OAuth2Client, UserRefreshClient } from 'google-auth-library'
export const dynamic = 'force-dynamic'; // static by default, unless reading the request

const app = new Hono().basePath('/api')
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage',
);


app.post('/auth/google', async (c) => {
    const { code } = await c.req.json()
    const { tokens } = await oAuth2Client.getToken(code); // exchange code for tokens
    console.log(tokens);
    return c.json({
        tokens
    })
})

app.post('/auth/google/refresh-token', async (c) => {
    const { refreshToken } = await c.req.json()
    const user = new UserRefreshClient(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        refreshToken,
    );
    const { credentials } = await user.refreshAccessToken(); // optain new tokens
    c.json(credentials);
})



export const GET = handle(app)
export const POST = handle(app)
