// src/api/adminApi.js
const API_BASE = "http://localhost:5000";

// Helper to call backend with Firebase ID token
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
      // ignore JSON parse error
    }
    throw new Error(message);
  }

  return res.json();
}

// ---------- USERS ----------
export function getAllUsers(idToken) {
  return authFetch("/api/admin/users", { method: "GET" }, idToken);
}

export function updateUserRole(idToken, userId, role) {
  return authFetch(
    `/api/admin/users/${userId}/role`,
    {
      method: "PATCH",
      body: JSON.stringify({ role }),
    },
    idToken
  );
}

export function createManualUser(idToken, userData) {
  return authFetch(
    "/api/admin/users/manual",
    {
      method: "POST",
      body: JSON.stringify(userData),
    },
    idToken
  );
}

// ---------- PUBLICATIONS (Admin add / review) ----------
export function createPublication(idToken, pubData) {
  return authFetch(
    "/api/admin/publications",
    {
      method: "POST",
      body: JSON.stringify(pubData),
    },
    idToken
  );
}

export function getAllPublications(idToken) {
  return authFetch("/api/admin/publications", { method: "GET" }, idToken);
}

export function updatePublicationStatus(idToken, pubId, status) {
  return authFetch(
    `/api/admin/publications/${pubId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
    idToken
  );
}

export function updatePublication(idToken, pubId, data) {
  return authFetch(
    `/api/admin/publications/${pubId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    idToken
  );
}

// ---------- PUBLICATIONS (Public, no auth) ----------
export async function getPublicationsPublic() {
  const res = await fetch(`${API_BASE}/api/publications`, {
    method: "GET",
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

// ---------- TEAMS (Admin) ----------
export function getAllTeams(idToken) {
  return authFetch("/api/admin/teams", { method: "GET" }, idToken);
}

// ---------- CONFERENCES (Admin) ----------
export function getAllConferences(idToken) {
  return authFetch("/api/admin/conferences", { method: "GET" }, idToken);
}

// ---------- TEAMS (Lead) ----------
export function getMyTeam(idToken) {
  return authFetch("/api/lead/team", { method: "GET" }, idToken);
}

// ---------- CONFERENCES (Lead) ----------
export function getLeadConferences(idToken) {
  return authFetch("/api/lead/conferences", { method: "GET" }, idToken);
}

export function createConference(idToken, data) {
  return authFetch(
    "/api/lead/conferences",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    idToken
  );
}

export function updateConferenceStatus(idToken, confId, status) {
  return authFetch(
    `/api/lead/conferences/${confId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
    idToken
  );
}

export function updateConference(idToken, confId, data) {
  return authFetch(
    `/api/lead/conferences/${confId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    idToken
  );
}
