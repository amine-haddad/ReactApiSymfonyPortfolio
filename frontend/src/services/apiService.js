const API_BASE_URL = "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erreur: ${response.status} ${response.statusText} - ${errorText}`
    );
  }
  return response.json();
};

const request = async (endpoint, options = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  return handleResponse(response);
};

export const fetchData = (endpoint) => request(endpoint, { method: "GET" });
export const postData = (endpoint, data) =>
  request(endpoint, { method: "POST", body: JSON.stringify(data) });
export const putData = (endpoint, data) =>
  request(endpoint, { method: "PUT", body: JSON.stringify(data) });
export const deleteData = (endpoint) => request(endpoint, { method: "DELETE" });
