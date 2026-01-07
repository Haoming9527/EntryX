"use client";

import "./globals.css";
import { WalletProvider } from "../components/providers/WalletProvider";
import { Header } from "../components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>EntryX - Tokenized Ticketing</title>
        <meta name="description" content="EntryX: The Future of Event Ticketing on XRPL" />
      </head>
      <body>
        <WalletProvider>
          <Header />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
