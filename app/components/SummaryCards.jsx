import { TrendingDown, TrendingUp } from "lucide-react";

export default function SummaryCards({ transactions = [] }) {
  const debit = transactions
    .filter((t) => t.type === "Debit")
    .reduce((a, b) => a + b.amount, 0);

  const credit = transactions
    .filter((t) => t.type === "Credit")
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-10">
      <Card title="Total Expenses" value={debit} icon={<TrendingDown />} red />
      <Card title="Total Income" value={credit} icon={<TrendingUp />} />
    </div>
  );
}

function Card({ title, value, icon, red }) {
  return (
    <div
      className={`p-8 rounded-4xl text-white shadow-2xl ${
        red
          ? "bg-linear-to-br from-rose-500 to-pink-600"
          : "bg-linear-to-br from-emerald-500 to-teal-600"
      }`}
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm uppercase">{title}</p>
          <p className="text-4xl font-bold mt-2">
            ₹ {value.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white/20 p-3 rounded-xl">{icon}</div>
      </div>
    </div>
  );
}
