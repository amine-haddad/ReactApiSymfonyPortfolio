// apiService.js

const API_BASE_URL = "/api"; // URL de base de l'API, à adapter si nécessaire

// Récupérer les en-têtes pour l'authentification
const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt_token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
};

// Faire une requête GET
export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des données: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Faire une requête POST
export const postData = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Erreur lors de l'envoi des données: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Faire une requête PUT (mise à jour)
export const putData = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Erreur lors de la mise à jour des données: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Faire une requête DELETE
export const deleteData = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Erreur lors de la suppression des données: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Ajouter plus de méthodes selon les besoins pour tes endpoints
