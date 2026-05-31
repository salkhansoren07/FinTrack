import Link from "next/link";
import GmailPrivacyDisclosure from "../components/GmailPrivacyDisclosure";
import LegalPageLayout from "../components/LegalPageLayout";

export const metadata = {
  title: "Gmail Privacy | FinTrak",
  description:
    "How FinTrak uses Gmail read-only access for transaction tracking and Google API Limited Use compliance.",
  alternates: {
    canonical: "/gmail-privacy",
  },
};

export default function GmailPrivacyPage() {
  return (
    <LegalPageLayout
      eyebrow="Gmail Privacy"
      title="How FinTrak uses Gmail access"
      description="FinTrak asks for Gmail access only after you choose to connect Google. This page explains the permission, the data used for transaction tracking, and how to stay in control."
      effectiveDate="April 1, 2026"
    >
      <GmailPrivacyDisclosure className="mb-8" showPolicyLink={false} />

      <h2>Permission requested</h2>
      <p>
        FinTrak requests the Gmail read-only scope
        <code> https://www.googleapis.com/auth/gmail.readonly</code>. This
        permission lets FinTrak read Gmail messages and metadata after you grant
        consent through Google OAuth.
      </p>
      <p>
        FinTrak does not request permission to send, delete, archive, label,
        draft, or modify email.
      </p>

      <h2>Why Gmail access is needed</h2>
      <p>
        FinTrak uses Gmail access to find transaction-related messages from
        banks, UPI apps, payment providers, and merchants, then convert those
        messages into a personal finance dashboard.
      </p>

      <h2>Data FinTrak may process</h2>
      <ul>
        <li>message metadata needed to identify transaction emails</li>
        <li>transaction date, amount, currency, bank, merchant, and category</li>
        <li>payment identifiers such as UPI VPA or counterparty text when present</li>
        <li>Google profile email and subject identifier used to maintain the link</li>
        <li>encrypted refresh tokens used to keep Gmail connected after consent</li>
      </ul>

      <h2>What FinTrak does not do</h2>
      <ul>
        <li>does not sell Gmail data</li>
        <li>does not use Gmail data for advertising or ad targeting</li>
        <li>does not let humans review Gmail content for unrelated purposes</li>
        <li>does not train unrelated AI models on Gmail data</li>
        <li>does not send, delete, modify, archive, or label email</li>
      </ul>

      <h2>Google API Limited Use</h2>
      <p>
        FinTrak&apos;s use and transfer of information received from Google APIs
        adheres to the Google API Services User Data Policy, including the
        Limited Use requirements.
      </p>

      <h2>Your controls</h2>
      <ul>
        <li>Reconnect Gmail from the FinTrak profile page if access expires</li>
        <li>Revoke FinTrak access from your Google Account permissions page</li>
        <li>Delete your FinTrak account to remove the saved Gmail connection data</li>
        <li>Contact support for Gmail access, deletion, or verification questions</li>
      </ul>

      <h2>Public OAuth verification</h2>
      <p>
        Gmail read-only access is a restricted Google OAuth scope. Public
        deployments should complete Google OAuth app verification, and Google may
        require additional review or a security assessment depending on the
        requested scope, user type, and launch scope.
      </p>

      <h2>Related pages</h2>
      <p>
        Review the full <Link href="/privacy">Privacy Policy</Link> and{" "}
        <Link href="/terms">Terms of Service</Link> before using FinTrak with a
        production Google OAuth app.
      </p>
    </LegalPageLayout>
  );
}
