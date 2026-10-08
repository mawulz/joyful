

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI!, {
    tls: true,
})

let clientPromise: Promise<MongoClient> | null = null

function getConnectedClient(): Promise<MongoClient> {
    if (!clientPromise) {
        clientPromise = client.connect()
    }
    return clientPromise
}

const trustedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ...(process.env.TRUSTED_ORIGINS?.split(",") || []),
]

const connectedClient = await getConnectedClient()
const db = connectedClient.db()

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client: connectedClient,
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: trustedOrigins,
    user: {
        additionalFields: {
            phoneNumber: {
                type: "string",
                required: false,
                defaultValue: "",
                input: true,
            },
            dateOfBirth: {
                type: "date",
                required: false,
                defaultValue: null,
                input: true,
            },
            isVolunteer: {
                type: "boolean",
                required: false,
                defaultValue: false,
                input: false,
            },
        },
    },
    plugins: [admin()],
    rateLimit: {
        enabled: true,
        window: 60,
        max: 5
    }
})

export async function getSession() {
    const result = await auth.api.getSession({
        headers: await headers()
    })

    return result;
}
