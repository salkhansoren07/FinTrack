"use client";

import { createContext, useContext, useState, useMemo } from "react";

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);

  const [dateFilter, setDateFilter] = useState({
    type: "month",
    month: new Date().toLocaleDateString("en-CA").slice(0, 7),
    start: null,
    end: null,
  });

  // ✅ MOVED FILTER LOGIC HERE
  const filteredTransactions = useMemo(() => {
    if (!transactions.length) return [];

    return transactions.filter((t) => {
      const txnDate = new Date(t.timestamp);

      if (dateFilter.type === "all") return true;

      if (dateFilter.type === "month") {
        if (!dateFilter.month) return true;

        const [year, month] = dateFilter.month.split("-");

        return (
          txnDate.getFullYear() === Number(year) &&
          txnDate.getMonth() === Number(month) - 1
        );
      }

      if (dateFilter.type === "custom") {
        if (!dateFilter.start || !dateFilter.end) return true;

        const start = new Date(dateFilter.start);
        const end = new Date(dateFilter.end);
        end.setHours(23, 59, 59, 999);

        return txnDate >= start && txnDate <= end;
      }

      return true;
    });
  }, [transactions, dateFilter]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        setTransactions,
        dateFilter,
        setDateFilter,
        filteredTransactions, // ✅ Added here
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => useContext(TransactionContext);
