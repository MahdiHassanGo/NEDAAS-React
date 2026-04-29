const API_BASE_URL =
  "https://nedaas-backend.vercel.app" ||"nedaas-backend-bm9q20bks-mahdi-hassan-noor-asifs-projects.vercel.app "|| "http://localhost:5000";


export async function loginWithFirebaseToken(idToken) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ idToken }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Login request failed");
  }

  return data;
}

export async function getCurrentUser(idToken) {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch current user");
  }

  return data;
}