
import express, { json } from "express";
import serverless from "serverless-http";
import { extractTokenFromHeader, verifyJWT } from "./utils.js";
import { JWT_SECRET, NODE_ENV, USERS_TABLE } from "./config.js";
import { getNewGoogleAccessTokenByEmail, getTokens } from "./app.js";
import cors from 'cors'
const app = express();
app.use(cors({}))
app.use(json());
app.use(express.urlencoded({ extended: true }));

//auth middleware
const auth = async (req, res, next) => {
    const token = extractTokenFromHeader(req);
    console.log({ token })
    if (!token) {
        return res.status(401).json({
            error: "Unauthorized",
        });
    }
    try {
        const decoded = verifyJWT(token, JWT_SECRET);
        req.email = decoded.email;
        next();
    } catch (error) {
        return res.status(401).json({
            error: "Unauthorized invalid token",
        });
    }
}

app.get("/", async function (req, res) {
    res.json({
        message: "Welcome to the Serverless Stack API",
        table: USERS_TABLE
    });
});

app.get("/tokens", async function (req, res) {
    const code = req.query.code;
    if (!code) {
        return res.status(400).json({ error: "code is required" })
    }
    const result = await getTokens(code);
    res.status(result.statusCode).send(result);
});

app.get("/google/refresh/access_token", auth, async function (req, res) {
    const email = req.email
    const result = await getNewGoogleAccessTokenByEmail(email);
    res.status(result.statusCode).send(result);
});



app.use((req, res, next) => {
    res.status(404).json({
        error: "Not Found",
    });
});

if (NODE_ENV === "local") {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}
export const handler = serverless(app);