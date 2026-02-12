"use client";

import { useTransactions } from "../context/TransactionContext";

export default function DateFilter() {
  const { dateFilter, setDateFilter } = useTransactions();

  return (
    <div className="flex flex-wrap gap-3 mb-6">

      {/* FILTER TYPE */}
      <select
        value={dateFilter.type}
        onChange={(e) =>
          setDateFilter({ ...dateFilter, type: e.target.value })
        }
        className=" rounded-lg px-3 py-2 text-slate-400 bg-white dark:bg-gray-900"
      >
        <option value="month">Month</option>
        <option value="custom">Custom Range</option>
        <option value="all">All Time</option>
      </select>

      {/* MONTH PICKER */}
      {dateFilter.type === "month" && (
        <input
          type="month"
          value={dateFilter.month}
          onChange={(e) =>
            setDateFilter({ ...dateFilter, month: e.target.value })
          }
          className=" rounded-lg px-3 py-2 text-slate-400 bg-white dark:bg-gray-900"
        />
      )}

      {/* CUSTOM RANGE */}
      {dateFilter.type === "custom" && (
        <>
          <input
            type="date"
            onChange={(e) =>
              setDateFilter({ ...dateFilter, start: e.target.value })
            }
            className="border rounded-lg px-3 py-2 text-slate-400 bg-white dark:bg-gray-900"
          />

          <input
            type="date"
            onChange={(e) =>
              setDateFilter({ ...dateFilter, end: e.target.value })
            }
            className="border rounded-lg px-3 py-2 text-slate-400 bg-white dark:bg-gray-900"
          />
        </>
      )}
    </div>
  );
}
