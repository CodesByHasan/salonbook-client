// Express server base URL (no trailing slash).
const API_URL = (process.env.API_URL || "http://localhost:5000").replace(/\/+$/, "");

if (process.env.VERCEL && !process.env.API_URL) {
  throw new Error("API_URL is not set. Add it in the Vercel project settings.");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // The browser only talks to this origin. /api/* is forwarded to the Express server,
  // so auth cookies are first-party (works on localhost and on Vercel).
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
};

export default nextConfig;
