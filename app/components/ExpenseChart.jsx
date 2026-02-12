"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

// Glowing active dot
const GlowDot = ({ cx, cy, stroke }) => {
  if (!cx || !cy) return null;

  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={stroke} opacity={0.2} />
      <circle cx={cx} cy={cy} r={5} fill={stroke} />
    </g>
  );
};

export default function ExpenseChart({ transactions = [] }) {
  // Group by date → income + expense
  const map = {};

  transactions.forEach(t => {
    if (!map[t.dateLabel]) {
      map[t.dateLabel] = {
        date: t.dateLabel,
        expense: 0,
        income: 0,
      };
    }

    if (t.type === "Debit") map[t.dateLabel].expense += t.amount;
    if (t.type === "Credit") map[t.dateLabel].income += t.amount;
  });

  const data = Object.values(map);

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl">
      <h3 className="font-semibold text-slate-400 mb-4">Income vs Expense</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>


          <XAxis dataKey="date" />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              borderRadius: "12px",
              border: "none",
            }}
          />

          <Area
            type="monotone"
            dataKey="expense"
            stroke="#EF4444"
            fill="#EF4444"
            fillOpacity={0.2}
          />

          <Line
            type="monotone"
            dataKey="income"
            stroke="#10B981"
            dot={<GlowDot />}
            activeDot={<GlowDot />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}