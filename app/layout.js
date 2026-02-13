import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Script from "next/script";
import { TransactionProvider } from "./context/TransactionContext";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

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
