"use client";

import Link from "next/link";
import { Ban, Database, MailCheck, ShieldCheck, Trash2 } from "lucide-react";

const DISCLOSURE_POINTS = [
  {
    icon: MailCheck,
    title: "Read-only Gmail access",
    description:
      "FinTrak requests Gmail read-only permission so it can find transaction emails from banks, UPI apps, and payment services.",
  },
  {
    icon: Database,
    title: "Only finance details are saved",
    description:
      "The dashboard stores transaction details such as amount, date, merchant, bank, payment type, and category.",
  },
  {
    icon: Ban,
    title: "No inbox changes or advertising",
    description:
      "FinTrak cannot send, delete, or modify emails, and Gmail data is not sold or used for ads.",
  },
  {
    icon: Trash2,
    title: "You stay in control",
    description:
      "You can revoke Google access from your Google account or delete your FinTrak account and stored connection data.",
  },
];

export default function GmailPrivacyDisclosure({
  className = "",
  compact = false,
  showPolicyLink = true,
}) {
  if (compact) {
    return (
      <div
        className={`rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-left dark:border-blue-900/40 dark:bg-blue-950/20 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <ShieldCheck size={17} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Before you connect Gmail
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              FinTrak uses read-only Gmail access to find transaction emails. It
              does not send, delete, modify, sell, or use Gmail data for ads.
            </p>
            {showPolicyLink ? (
              <Link
                href="/gmail-privacy"
                className="mt-3 inline-flex text-sm font-semibold text-blue-700 transition hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
              >
                Review Gmail privacy details
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
            Gmail privacy
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
            What FinTrak can and cannot do with Gmail
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Gmail is connected only after you approve Google OAuth. FinTrak uses
            that access to power your finance dashboard, not to operate your
            inbox or advertise to you.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {DISCLOSURE_POINTS.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm dark:bg-slate-900 dark:text-blue-300">
                <Icon size={17} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPolicyLink ? (
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
          <Link
            href="/gmail-privacy"
            className="text-blue-700 transition hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
          >
            Read Gmail privacy details
          </Link>
          <Link
            href="/privacy"
            className="text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Full privacy policy
          </Link>
        </div>
      ) : null}
    </section>
  );
}
