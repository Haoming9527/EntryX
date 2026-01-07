"use client";

import { Header } from "../components/Header";
import { AccountInfo } from "../components/AccountInfo";
import { ContractInteraction } from "../components/ContractInteraction";
import { TransactionForm } from "../components/TransactionForm";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Scaffold-XRP</h1>
          <p className="text-gray-600">
            A starter kit for building dApps on XRPL with smart contracts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <AccountInfo />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
           <a href="/dashboard" className="group block p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all hover:border-blue-300">
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600">Organizer Dashboard &rarr;</h3>
            <p className="text-gray-600">Mint new event tickets as NFTs on the XRPL.</p>
           </a>

           <a href="/events" className="group block p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all hover:border-blue-300">
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600">Event Marketplace &rarr;</h3>
            <p className="text-gray-600">Browse and buy tickets with RLUSD.</p>
           </a>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-3">Getting Started</h2>
          <div className="space-y-2 text-sm">
            <p>1. Connect your wallet using the button in the header</p>
            <p>2. Go to Organizer Dashboard to Mint a Ticket</p>
            <p>3. Go to Event Marketplace to Buy a Ticket</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>Built with Scaffold-XRP 🚀</p>
        </div>
      </footer>
    </div>
  );
}
