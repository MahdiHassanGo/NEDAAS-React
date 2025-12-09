// src/api/publicationApi.js
const API_BASE = "http://localhost:5000";

async function authFetch(path, options = {}, idToken) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(idToken
        ? {
            Authorization: `Bearer ${idToken}`,
          }
        : {}),
    },
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      message = errorData.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json();
}

// POST /api/lead/publications
export function createPublicationAsLead(idToken, data) {
  return authFetch(
    "/api/lead/publications",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    idToken
  );
}

const publicationApi = {
  createPublicationAsLead,
};

export default publicationApi;
