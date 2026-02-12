export async function fetchBankEmails(token) {
  const now = new Date();
  const firstDay = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/01`;
  const query = `after:${firstDay} (debited OR credited OR transaction)`;
  const headers = { Authorization: `Bearer ${token}` };

  const messages = [];
  let pageToken = null;

  do {
    const params = new URLSearchParams({ q: query, maxResults: "500" });
    if (pageToken) params.set("pageToken", pageToken);

    const listRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`,
      { headers }
    );

    if (!listRes.ok) {
      throw new Error(`Gmail list fetch failed: ${listRes.status}`);
    }

    const listData = await listRes.json();
    if (Array.isArray(listData.messages)) {
      messages.push(...listData.messages);
    }
    pageToken = listData.nextPageToken || null;
  } while (pageToken);

  if (!messages.length) return [];

  const detailResults = await Promise.allSettled(
    messages.map(async (msg) => {
      const r = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
        { headers }
      );
      if (!r.ok) {
        throw new Error(`Gmail message fetch failed: ${r.status} (${msg.id})`);
      }
      return r.json();
    })
  );

  return detailResults
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);
}
