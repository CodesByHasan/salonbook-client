// Express server base URL (no trailing slash).
const API_URL = (process.env.API_URL || "http://localhost:5001").replace(/\/+$/, "");

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

  // Forward /api/* requests to the Express server.
  // The browser communicates with the Next.js origin.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

