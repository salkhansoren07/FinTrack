export async function fetchCloudUserData(token) {
  if (!token) return null;

  const res = await fetch("/api/user-data", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;

  return res.json();
}

export async function saveCloudUserData(token, categoryOverrides) {
  if (!token) return false;

  const res = await fetch("/api/user-data", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ categoryOverrides }),
  });

  return res.ok;
}
