"use client";

import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = [
  "#3B82F6", // blue
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EF4444", // rose
  "#8B5CF6", // violet
  "#06B6D4", // cyan
];

export default function CategoryChart({ transactions = [] }) {
  const dataMap = {};

  transactions.forEach(t => {
    if (t.type !== "Debit") return;
    dataMap[t.category] = (dataMap[t.category] || 0) + t.amount;
  });

  const data = Object.entries(dataMap).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl">
      <h3 className="font-semibold text-slate-400 mb-4">
        Spending by Category
      </h3>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={4}
            label={false}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
