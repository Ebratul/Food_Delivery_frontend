import axios from "axios";

export const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
export const TOKEN_KEY = "fooddash-token";

export const api = axios.create({ baseURL: `${API_URL}/api`, timeout: 20000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Listeners notified when the server says the session is no longer valid (expired token etc.)
const sessionListeners = new Set();
export const onSessionExpired = (fn) => { sessionListeners.add(fn); return () => sessionListeners.delete(fn); };

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const code = error.response?.data?.error?.code;
    if (error.response?.status === 401 && ["TOKEN_EXPIRED", "INVALID_TOKEN"].includes(code)) {
      sessionListeners.forEach((fn) => fn(code));
    }
    return Promise.reject(error);
  },
);

/** Human-readable message from an API error. */
export const errorMessage = (error, fallback = "Something went wrong. Please try again.") =>
  error?.response?.data?.error?.message ?? (error?.code === "ERR_NETWORK" ? "Cannot reach the server. Check your connection." : fallback);

/** Field errors from a 422 response: { fieldName: message } */
export const fieldErrors = (error) =>
  Object.fromEntries((error?.response?.data?.error?.details ?? []).map((d) => [d.field, d.message]));

/** Unwraps { success, data, meta } responses. */
export const get = (url, params) => api.get(url, { params }).then((r) => r.data);
export const post = (url, body) => api.post(url, body).then((r) => r.data);
export const patch = (url, body) => api.patch(url, body).then((r) => r.data);
export const del = (url) => api.delete(url).then((r) => r.data);

export function upload(url, file) {
  const form = new FormData();
  form.append("image", file);
  return api.post(url, form, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
}
