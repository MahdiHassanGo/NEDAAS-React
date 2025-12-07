// src/api/authApi.js
const API_BASE_URL = "http://localhost:5000"; // change this when you deploy

export async function loginWithFirebaseToken(idToken) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // keep for future cookies if needed
    body: JSON.stringify({ idToken }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Login request failed");
  }

  return data; // { message, role, user }
}
