
import axios from "axios";

const rawApiUrl =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:8080" : "");

const baseURL = rawApiUrl.replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

let csrfRequest = null;

api.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toLowerCase();

  if (!["post", "put", "patch", "delete"].includes(method)) {
    return config;
  }

  if (!csrfRequest) {
    csrfRequest = api
      .get("/api/auth/csrf")
      .finally(() => {
        csrfRequest = null;
      });
  }

  const response = await csrfRequest;
  const token = response.data?.token;

  if (!token) {
    throw new Error("Failed to obtain CSRF token from backend.");
  }

  config.headers.set("X-XSRF-TOKEN", token);

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url;

    if (
      error.response?.status === 401 &&
      url !== "/api/auth/me" &&
      url !== "/api/auth/login"
    ) {
      window.dispatchEvent(new Event("roadassist:session-expired"));
    }

    return Promise.reject(error);
  }
);

export default api;
