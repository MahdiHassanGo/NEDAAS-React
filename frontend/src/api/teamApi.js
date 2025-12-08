// src/api/teamApi.js
const API_BASE = "http://localhost:5000";

// Small helper for authenticated fetch
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
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  return res.json();
}

/* =========================================================
 * ADMIN – TEAM MANAGEMENT
 * =======================================================*/

// GET /api/admin/teams
export function getAllTeams(idToken) {
  return authFetch("/api/admin/teams", { method: "GET" }, idToken);
}

// POST /api/admin/teams/assign-member
export function assignMemberToLead(idToken, { memberId, leadId }) {
  return authFetch(
    "/api/admin/teams/assign-member",
    {
      method: "POST",
      body: JSON.stringify({ memberId, leadId }),
    },
    idToken
  );
}

// PUT /api/admin/teams/members/:memberId
export function updateMemberInfo(idToken, memberId, data) {
  return authFetch(
    `/api/admin/teams/members/${memberId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    idToken
  );
}

// GET /api/admin/conferences
export function getAllConferences(idToken) {
  return authFetch("/api/admin/conferences", { method: "GET" }, idToken);
}

/* =========================================================
 * LEAD – TEAM & CONFERENCES
 * =======================================================*/

// GET /api/lead/team
export function getMyTeam(idToken) {
  return authFetch("/api/lead/team", { method: "GET" }, idToken);
}

// GET /api/lead/conferences
export function getMyConferences(idToken) {
  return authFetch("/api/lead/conferences", { method: "GET" }, idToken);
}

// POST /api/lead/conferences
export function createConference(idToken, confData) {
  return authFetch(
    "/api/lead/conferences",
    {
      method: "POST",
      body: JSON.stringify(confData),
    },
    idToken
  );
}

// PUT /api/lead/conferences/:confId
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

// (optional) default export, in case you ever import teamApi as a whole
const teamApi = {
  getAllTeams,
  assignMemberToLead,
  updateMemberInfo,
  getAllConferences,
  getMyTeam,
  getMyConferences,
  createConference,
  updateConference,
};

export default teamApi;
