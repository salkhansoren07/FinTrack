function decodeBase64(data) {
  const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + (4 - (base64.length % 4)) % 4,
    "="
  );
  return atob(padded);
}

function extractBody(payload) {
  if (payload.body?.data) return payload.body.data;
  if (payload.parts) {
    for (const part of payload.parts) {
      const data = extractBody(part);
      if (data) return data;
    }
  }
  return null;
}

export function parseTransaction(email) {
  if (!email?.payload) return null;

  // 1. Extract Headers to check 'From' or 'Subject' for Bank Name
  const headers = email.payload.headers || [];
  const subject = headers.find(h => h.name === 'Subject')?.value || "";
  const from = headers.find(h => h.name === 'From')?.value || "";
  
  const bodyData = extractBody(email.payload);
  if (!bodyData) return null;

  let decoded = "";
  try {
    decoded = decodeBase64(bodyData);
  } catch {
    return null;
  }
  
  // Combine all text sources to search for the bank
  const fullContext = `${subject} ${from} ${decoded}`;

  const amountMatch = decoded.match(/Rs\.?\s?([\d,]+)/i);
  const amount = Number(amountMatch?.[1]?.replace(/,/g, "") || 0);

  const type = /debited/i.test(decoded)
    ? "Debit"
    : /credited/i.test(decoded)
    ? "Credit"
    : "Unknown";

  const vpaMatch =
    decoded.match(
      /(?:VPA|UPI ID|Payee|to|towards)\s*([a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64})/i
    ) || decoded.match(/[a-zA-Z0-9.\-_]+@[a-zA-Z]{2,64}/);

  const vpa = vpaMatch?.[1] || vpaMatch?.[0] || "N/A";

  // 2. Enhanced Bank Detection
  const bankPatterns = [
    { name: "HDFC", regex: /HDFC/i },
    { name: "SBI", regex: /SBI|State Bank/i },
    { name: "ICICI", regex: /ICICI/i },
    { name: "Axis", regex: /Axis/i },
    { name: "Kotak", regex: /Kotak/i },
    { name: "PNB", regex: /PNB|Punjab National/i },
  ];

  // We search the 'fullContext' (Subject + From + Body)
  const foundBank = bankPatterns.find((b) => b.regex.test(fullContext));
  const bank = foundBank ? foundBank.name : "Other";
// 3. Category Detection (rule based)

  let category = "Other";

  const categoryRules = [
    { name: "Food", regex: /zomato|swiggy|restaurant|food|domino|pizza/i },
    { name: "Shopping", regex: /amazon|flipkart|myntra|meesho|ajio/i },
    { name: "Transfer", regex: /upi|paytm|phonepe|gpay|transfer/i },
    { name: "Bills", regex: /electricity|recharge|broadband|gas|bill/i },
  ];

  const foundCategory = categoryRules.find(c =>
    c.regex.test(fullContext)
  );

  if (foundCategory) category = foundCategory.name;

  const timestamp = Number(email.internalDate);
  const dateObj = new Date(timestamp);

  return {
    id: email.id,
    amount,
    type,
    bank,
    vpa,
    category,
    timestamp,
    dateLabel: dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
  };
}
