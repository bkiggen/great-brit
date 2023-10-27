import { store } from "../store";

export const fetchFromApi = async (url, method, body) => {
  const state = store.getState();
  const { sessionToken } = state.session;

  const res = await fetch(`http://100.26.32.89:4000${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message);
  }

  const data = await res.json();
  return data;
};

export const makeRequest = {
  get: async (url) => fetchFromApi(url, "GET"),
  post: async (url, body) => fetchFromApi(url, "POST", body),
  put: async (url, body) => fetchFromApi(url, "PUT", body),
  delete: async (url, body) => fetchFromApi(url, "DELETE", body),
};
