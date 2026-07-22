const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Strip a trailing "/api" (and any trailing slash) to get the server's origin,
// used for static assets like /uploads.
export const API_URL = RAW_API_URL.replace(/\/+$/, "");
export const SERVER_URL = API_URL.replace(/\/api$/, "");
export const UPLOADS_URL = `${SERVER_URL}/uploads`;
