import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

const baseURL = 
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

export const authClient = createAuthClient({
    baseURL: baseURL,
    plugins: [
        adminClient()
    ]
})

export const {signIn, signUp, signOut, useSession} = authClient