// src/api/teamApi.js
const API_BASE = "https://nedaas-backend.vercel.app" ||"nedaas-backend-bm9q20bks-mahdi-hassan-noor-asifs-projects.vercel.app";

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

// DELETE /api/admin/teams/members/:memberId  (unassign from lead)
export function removeMemberFromLead(idToken, memberId) {
  return authFetch(
    `/api/admin/teams/members/${memberId}`,
    {
      method: "DELETE",
    },
    idToken
  );
}

// GET /api/admin/conferences
export function getAllConferences(idToken) {
  return authFetch("/api/admin/conferences", { method: "GET" }, idToken);
}

// POST /api/admin/conferences
export function createConferenceForLead(idToken, data) {
  // data: { title, date, link, status, leadId, authorIds? }
  return authFetch(
    "/api/admin/conferences",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    idToken
  );
}

// PUT /api/admin/conferences/:id
export function updateConferenceByAdmin(idToken, confId, data) {
  return authFetch(
    `/api/admin/conferences/${confId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    idToken
  );
}

// DELETE /api/admin/conferences/:id
export function deleteConferenceByAdmin(idToken, confId) {
  return authFetch(
    `/api/admin/conferences/${confId}`,
    {
      method: "DELETE",
    },
    idToken
  );
}

// GET /api/admin/authors
export function getAllAuthors(idToken) {
  return authFetch("/api/admin/authors", { method: "GET" }, idToken);
}

// POST /api/admin/authors
export function createAuthorByAdmin(idToken, data) {
  return authFetch(
    "/api/admin/authors",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    idToken
  );
}

// PUT /api/admin/authors/:id
export function updateAuthorByAdmin(idToken, authorId, data) {
  return authFetch(
    `/api/admin/authors/${authorId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    idToken
  );
}

// DELETE /api/admin/authors/:id
export function deleteAuthorByAdmin(idToken, authorId) {
  return authFetch(
    `/api/admin/authors/${authorId}`,
    {
      method: "DELETE",
    },
    idToken
  );
}

/* =========================================================
 * LEAD – TEAM & CONFERENCES
 * =======================================================*/

// GET /api/lead/team
export function getMyTeam(idToken) {
  return authFetch("/api/lead/team", { method: "GET" }, idToken);
}

// POST /api/lead/members  (lead creates/attaches member under themselves)
export function createMyMember(idToken, data) {
  return authFetch(
    "/api/lead/members",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    idToken
  );
}// GET /api/lead/authors
export function getMyAuthors(idToken) {
  return authFetch("/api/lead/authors", { method: "GET" }, idToken);
}

// POST /api/lead/authors
export function createMyAuthor(idToken, data) {
  return authFetch(
    "/api/lead/authors",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    idToken
  );
}

// PUT /api/lead/authors/:authorId
export function updateMyAuthor(idToken, authorId, data) {
  return authFetch(
    `/api/lead/authors/${authorId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    idToken
  );
}


// PUT /api/lead/members/:memberId  (lead updates their member)
export function updateMyMember(idToken, memberId, data) {
  return authFetch(
    `/api/lead/members/${memberId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    idToken
  );
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

// POST /api/lead/conferences/:confId/publish-paper
// Submit a conference paper to the publication database
export function publishConferencePaper(idToken, confId, paperData) {
  return authFetch(
    `/api/lead/conferences/${confId}/publish-paper`,
    {
      method: "POST",
      body: JSON.stringify(paperData),
    },
    idToken
  );
}


const teamApi = {
  // admin
  getAllTeams,
  assignMemberToLead,
  updateMemberInfo,
  removeMemberFromLead,
  getAllConferences,
  createConferenceForLead,
  updateConferenceByAdmin,
  deleteConferenceByAdmin,
  getAllAuthors,
  createAuthorByAdmin,
  updateAuthorByAdmin,
  deleteAuthorByAdmin,
  // lead
  getMyTeam,
  createMyMember,
  updateMyMember,
  getMyConferences,
  createConference,
  updateConference,
  publishConferencePaper,
  getMyAuthors,
  createMyAuthor,
  updateMyAuthor,
};

export default teamApi;
