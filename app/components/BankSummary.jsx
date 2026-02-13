"use client";

import Link from "next/link";

export default function BankSummary({ transactions = [] }) {
  const banks = transactions.reduce((acc, t) => {
    if (!acc[t.bank]) acc[t.bank] = { debit: 0, credit: 0 };

    if (t.type === "Debit") acc[t.bank].debit += t.amount;
    if (t.type === "Credit") acc[t.bank].credit += t.amount;

    return acc;
  }, {});

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
      {Object.entries(banks).map(([bank, data]) => (
        <Link
          key={bank}
          href={`/bank/${encodeURIComponent(bank)}`}
          className="block bg-white dark:bg-gray-900 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl hover:scale-[1.02] transition"
        >
          <h3 className="font-semibold mb-2 md:mb-3 text-blue-500 break-words">
            {bank}
          </h3>

          <p className="text-rose-500 font-bold text-sm md:text-base">
            Debit: ₹ {data.debit.toLocaleString("en-IN")}
          </p>

          <p className="text-emerald-500 font-bold text-sm md:text-base mt-1">
            Credit: ₹ {data.credit.toLocaleString("en-IN")}
          </p>
        </Link>
      ))}
    </div>
  );
}
