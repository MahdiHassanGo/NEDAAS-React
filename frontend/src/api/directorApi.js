// src/api/directorApi.js
const API_BASE = "https://nedaas-backend.vercel.app" || "http://localhost:5000";

async function authFetch(path, options = {}, idToken) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
  });

  if (!res.ok) {
    let msg = `Request failed with status ${res.status}`;
    try {
      const errData = await res.json();
      msg = errData.message || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

/* ========= CONFERENCE OVERVIEW (READ ONLY) ========= */

// Director-only view of all conferences with lead & authors
export function getDirectorConferences(idToken) {
  // using /api/director/conferences (pure director endpoint)
  return authFetch("/api/director/conferences", { method: "GET" }, idToken);
}

/* ========= DIRECTOR CALENDAR ========= */

export function getDirectorCalendarEvents(idToken, status = "all") {
  const qs =
    status && status !== "all" ? `?status=${encodeURIComponent(status)}` : "";
  return authFetch(`/api/director/calendar${qs}`, { method: "GET" }, idToken);
}

export function createDirectorCalendarEvent(idToken, data) {
  return authFetch(
    "/api/director/calendar",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    idToken
  );
}

export function updateDirectorCalendarEvent(idToken, eventId, data) {
  return authFetch(
    `/api/director/calendar/${eventId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    idToken
  );
}

export function deleteDirectorCalendarEvent(idToken, eventId) {
  return authFetch(
    `/api/director/calendar/${eventId}`,
    {
      method: "DELETE",
    },
    idToken
  );
}

const directorApi = {
  getDirectorConferences,
  getDirectorCalendarEvents,
  createDirectorCalendarEvent,
  updateDirectorCalendarEvent,
  deleteDirectorCalendarEvent,
};

export default directorApi;
