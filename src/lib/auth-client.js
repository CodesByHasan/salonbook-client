import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

// No baseURL: requests go to this site's own /api/auth/*,
// which next.config.mjs proxies to the Express server.
export const authClient = createAuthClient({ plugins: [jwtClient()] });

export const { signIn, signUp, signOut } = authClient;