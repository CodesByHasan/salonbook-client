// Express server base URL. Server-side only (never sent to the browser).
export const API_URL = (process.env.API_URL || "http://localhost:8000").replace(/\/+$/, "");