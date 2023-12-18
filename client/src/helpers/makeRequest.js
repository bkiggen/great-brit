import { store } from "../store";

export const fetchFromApi = async (url, method, body) => {
  const state = store.getState();
  const { sessionToken } = state.session;

  // Construct the URL with query parameters
  const fullUrl = new URL(`http://localhost:4000${url}`);

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
    throw new Error(errorData.message);
  }

  const data = await res.json();
  return data;
};

export const makeRequest = {
  get: async (url, queryParams) => fetchFromApi(url, "GET", queryParams),
  post: async (url, body) => fetchFromApi(url, "POST", body),
  patch: async (url, body) => fetchFromApi(url, "PATCH", body),
  put: async (url, body) => fetchFromApi(url, "PUT", body),
  delete: async (url, body) => fetchFromApi(url, "DELETE", body),
};
