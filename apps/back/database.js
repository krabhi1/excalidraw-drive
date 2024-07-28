import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import * as uid from "uuid";
import { NODE_ENV, USERS_TABLE } from "./config.js";

const client = new DynamoDBClient({
    region: "ap-south-1",
});
const dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient(
    NODE_ENV === "local" ? { region: "ap-south-1" } : {}
));

export async function findUserByEmail(email) {
    const params = {
        TableName: USERS_TABLE,
        Key: {
            email: email,
        },
    };
    try {
        const { Item } = await dynamoDbClient.send(new GetCommand(params));
        return Item;
    } catch (error) {
        console.log(error);
        return undefined;
    }

}

async function createUser(email, refreshToken) {
    const params = {
        TableName: USERS_TABLE,
        Item: {
            email: email,
            refreshToken: refreshToken
        },
    };
    try {
        await dynamoDbClient.send(new PutCommand(params));
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

}

export async function upsertUser(email, refreshToken) {
    const params = {
        TableName: USERS_TABLE,
        Key: {
            email: email,
        },
        UpdateExpression: "SET refreshToken = :refreshToken",
        ExpressionAttributeValues: {
            ":refreshToken": refreshToken
        },
        ReturnValues: "ALL_NEW"
    };
    try {
        const result = await dynamoDbClient.send(new UpdateCommand(params));
        return result.Attributes;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}


async function test() {
    console.log("table ", USERS_TABLE);
    const email = "abhi@gmail.com"
    const result = await findUserByEmail(email);
    if (!result) {
        const refreshToken = uid.v4();
        const result2 = await createUser(email, refreshToken);
        if (result2) {
            console.log("user created ", { email, refreshToken });
        } else {
            console.log("user not created ", { email, refreshToken });
        }
    } else {
        console.log("user found ", result);
        //update
        const refreshToken = uid.v4();
        const result3 = await upsertUser(email, refreshToken);
        if (result3) {
            console.log("user updated ", result3);
        } else {
            console.log("user not updated ", result3);
        }
    }
}

// test();