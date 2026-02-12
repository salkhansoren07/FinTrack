export async function fetchBankEmails(token) {
  const now = new Date();
  const firstDay = `${now.getFullYear()}/${now.getMonth() + 1}/01`;

  const listRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=after:${firstDay} (debited OR credited OR transaction)`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const listData = await listRes.json();
  if (!listData.messages) return [];

  const details = await Promise.all(
    listData.messages.map(async (msg) => {
      const r = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return r.json();
    })
  );

  return details;
}
