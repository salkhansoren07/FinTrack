"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import { fetchBankEmails } from "./lib/gmailService";
import { parseTransaction } from "./lib/parseTransaction";
import Layout from "./components/Layout";
import SummaryCards from "./components/SummaryCards";
import TransactionTable from "./components/TransactionTable";
import ExpenseChart from "./components/ExpenseChart";
import { useTransactions } from "./context/TransactionContext";
import BankSummary from "./components/BankSummary";
import CategoryChart from "./components/CategoryChart";
import { useRouter } from "next/navigation";



export default function Home() {
  const { token, login } = useAuth();
  const { transactions, setTransactions } = useTransactions();
  const router = useRouter();
  const idleTimer = useRef(null);

  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);


  // INITIAL AUTH + PIN CHECK
  useEffect(() => {
    setIsInitializing(false);

    if (!token) return;

    const pin = localStorage.getItem("user_pin");
    const verified = sessionStorage.getItem("pin_verified");

    if (!pin) router.replace("/passcode");
    else if (!verified) router.replace("/unlock");
  }, [token]);

  // AUTO LOCK AFTER 5 MIN IDLE
  useEffect(() => {
    if (!token) return;

    const IDLE_TIME = 5 * 60 * 1000; // 5 minutes

    const resetTimer = () => {
      clearTimeout(idleTimer.current);

      idleTimer.current = setTimeout(() => {
        sessionStorage.removeItem("pin_verified");
        router.replace("/unlock");
      }, IDLE_TIME);
    };

    const events = ["mousemove", "keydown", "click", "touchstart"];

    events.forEach(e => window.addEventListener(e, resetTimer));

    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearTimeout(idleTimer.current);
    };
  }, [token]);

  // FETCH EMAILS
  useEffect(() => {
    if (!token) return;

    async function load() {
      setLoading(true);
      try {
        const emails = await fetchBankEmails(token);

        const overrides = JSON.parse(
          localStorage.getItem("categoryOverrides") || "{}"
        );

        const parsed = emails
          .map(parseTransaction)
          .filter(Boolean)
          .map(t => ({
            ...t,
            category: overrides[t.id] || t.category,
          }))
          .sort((a, b) => b.timestamp - a.timestamp);

        setTransactions(parsed);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  const { dateFilter } = useTransactions();

  const { filteredTransactions } = useTransactions();



  // LOADING
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        FinTrack is warming up...
      </div>
    );
  }

  // NOT LOGGED IN
  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-[#020617] dark:to-[#020617]">

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 text-center animate-in fade-in zoom-in duration-500">

          <div className="text-4xl mb-2">💰</div>

          <h1 className="text-3xl font-bold text-blue-600 mb-1">
            FinTrack
          </h1>

          <p className="text-slate-500 dark:text-gray-400 mb-8">
            Smart expense tracking from Gmail
          </p>

          <button
            onClick={login}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg transition-all active:scale-95"
          >
            Connect Gmail Account
          </button>

          <p className="text-xs text-slate-400 mt-6">
            Your data stays on your device.
          </p>
        </div>

      </div>
    );
  }


  // DASHBOARD
  return (
    <Layout>
      {loading ? (
        <div className="flex justify-center py-24">Syncing...</div>
      ) : loading ? (
        <div className="flex justify-center py-24">
          Syncing...
        </div>
      ) : filteredTransactions.length > 0 ? (
        <>
          <SummaryCards transactions={filteredTransactions} />
          <BankSummary transactions={filteredTransactions} />

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <ExpenseChart transactions={filteredTransactions} />
            <CategoryChart transactions={filteredTransactions} />
          </div>

          <TransactionTable transactions={filteredTransactions} />
        </>
      ) : (
        <div className="text-center py-24">
          No transactions found.
        </div>
      )}
    </Layout>
  );
}
