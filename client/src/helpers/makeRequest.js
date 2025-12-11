import { store } from "../store";
import { showSuccess, showError, showWarning } from "./notifier";
import { clearSession } from "../store/sessionSlice";

// List of success messages for different operations
const getSuccessMessage = (method, url) => {
  // Extract resource name from URL
  const urlParts = url.split("/").filter(Boolean);
  const resource = urlParts[urlParts.length - 1];

  switch (method) {
    case "POST":
      if (url.includes("/accept")) return "Bet accepted successfully";
      if (url.includes("/calculateDeltas")) return "Deltas calculated successfully";
      if (url.includes("/current")) return "Current episode set successfully";
      return "Created successfully";
    case "PATCH":
      return "Updated successfully";
    case "PUT":
      return "Updated successfully";
    case "DELETE":
      if (url.includes("/deltas")) return "Deltas cleared successfully";
      return "Deleted successfully";
    default:
      return "Success";
  }
};

export const fetchFromApi = async (url, method, body) => {
  const state = store.getState();
  const { sessionToken } = state.session;

  // In production, use same origin; in development, use localhost:8000
  const baseUrl = process.env.NODE_ENV === 'production'
    ? window.location.origin
    : (process.env.REACT_APP_API_URL || 'http://localhost:8000');

  // Construct the URL with query parameters - add /api prefix to all routes
  const apiUrl = url.startsWith('/api') ? url : `/api${url}`;
  const fullUrl = new URL(apiUrl, baseUrl);

  if (method === "GET" && body) {
    // Convert the query parameters object into URL search parameters
    const searchParams = new URLSearchParams(body);
    fullUrl.search = searchParams.toString();
  }

  const requestOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  };

  if (method !== "GET" && body) {
    requestOptions.body = JSON.stringify(body);
  }

  const res = await fetch(fullUrl.toString(), requestOptions);

  if (!res.ok) {
    const errorData = await res.json();

    // Handle expired/invalid session token
    if (res.status === 401) {
      store.dispatch(clearSession());
      showWarning("Your session has expired. Please log in again.");
      window.location.href = "/login";
      return;
    }

    const error = new Error(errorData.message || "Request failed");
    error.response = {
      status: res.status,
      data: errorData,
    };

    // Show error toast unless it's the calculateDeltas validation error
    // (which shows a confirmation dialog instead)
    if (errorData.error !== "USERS_WITHOUT_RANKINGS") {
      showError(errorData.message || "An error occurred");
    }

    throw error;
  }

  const data = await res.json();

  // Show success toast for non-GET requests
  if (method !== "GET") {
    const successMessage = getSuccessMessage(method, url);
    showSuccess(successMessage);
  }

  return data;
};

export const makeRequest = {
  get: async (url, queryParams) => fetchFromApi(url, "GET", queryParams),
  post: async (url, body) => fetchFromApi(url, "POST", body),
  patch: async (url, body) => fetchFromApi(url, "PATCH", body),
  put: async (url, body) => fetchFromApi(url, "PUT", body),
  delete: async (url, body) => fetchFromApi(url, "DELETE", body),
};
