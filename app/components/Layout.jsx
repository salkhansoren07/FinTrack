"use client";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    /* Added touch-pan-y and overscroll-behavior-x-none to block swipe-back */
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#020617] overscroll-behavior-x-none touch-pan-y">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        {/* overflow-x-hidden ensures no horizontal swiping room */}
        <main className="p-4 md:p-8 overflow-y-auto overflow-x-hidden w-full">
          {children}
        </main>
      </div>
    </div>
  );
}