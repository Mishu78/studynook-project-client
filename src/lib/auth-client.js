import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    jwtClient() 
  ]
});

// ✅ Correct: Export destructuring from your actual configured client
export const { signIn, signUp, signOut, useSession } = authClient;