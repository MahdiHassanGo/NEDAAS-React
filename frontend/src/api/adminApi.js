// src/api/adminApi.js
const API_BASE_URL = "http://localhost:5000"; // update when deploying

async function authFetch(path, options = {}, idToken) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${idToken}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

// ----- USERS -----
export async function getAllUsers(idToken) {
  return authFetch("/api/admin/users", { method: "GET" }, idToken);
}

export async function updateUserRole(idToken, userId, role) {
  return authFetch(
    `/api/admin/users/${userId}/role`,
    {
      method: "PATCH",
      body: JSON.stringify({ role }),
    },
    idToken
  );
}

export async function createManualUser(idToken, payload) {
  return authFetch(
    "/api/admin/users/manual",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    idToken
  );
}

// ----- PUBLICATIONS -----
export async function createPublication(idToken, payload) {
  return authFetch(
    "/api/admin/publications",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    idToken
  );
}

export async function getPublicationsPublic() {
  const res = await fetch(`${API_BASE_URL}/api/publications`);
  const data = await res.json().catch(() => []);

  if (!res.ok) {
    throw new Error(data.message || "Failed to load publications");
  }

  return data;
}
