import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Script from "next/script";
import { TransactionProvider } from "./context/TransactionContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />

        <AuthProvider>
          <TransactionProvider>
              {children}
          </TransactionProvider>
        </AuthProvider>

      </body>
    </html>
  );
}
