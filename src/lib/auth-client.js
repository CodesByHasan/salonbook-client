import { createAuthClient } from "better-auth/react";

// No baseURL: requests go to this site's own /api/auth/*,
// which next.config.mjs proxies to the Express server.
export const authClient = createAuthClient();

export const { signIn, signUp, signOut } = authClient;