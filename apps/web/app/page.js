"use client";

import { AccountInfo } from "../components/AccountInfo";
import { useWallet } from "../components/providers/WalletProvider";
import Link from 'next/link';

export default function Home() {
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen">
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 pb-4 pt-2 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-purple-500 leading-normal filter drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
            EntryX
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            The future of event ticketing. <span className="text-white">Secure. Verifiable. Seamless.</span>
          </p>
        </div>

        <div className={`grid grid-cols-1 ${isConnected ? 'lg:grid-cols-3' : 'max-w-4xl mx-auto'} gap-6 mb-12 items-stretch`}>
          {isConnected && (
            <div className="lg:col-span-1">
              <AccountInfo />
            </div>
          )}
          
          <div className={`${isConnected ? 'lg:col-span-2' : ''} grid grid-cols-1 gap-6 w-full`}>
             <Link href="/events" className="group block p-8 glass-card border-purple-500/40 hover:border-purple-400/60 transition-all shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-purple-400 flex items-center">
                Event Marketplace <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </h3>
              <p className="text-gray-400">Browse vibrant events and secure your spot with RLUSD.</p>
             </Link>

             <Link href="/tickets" className="group block p-8 glass-card border-green-500/40 hover:border-green-400/60 transition-all shadow-[0_0_20px_rgba(34,197,94,0.15)]">
              <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-green-400 flex items-center">
                My Tickets <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </h3>
              <p className="text-gray-400">View your collection and verify ownership instantly.</p>
             </Link>
          </div>
        </div>

        <div className={`mt-8 ${!isConnected ? 'max-w-4xl mx-auto' : ''}`}>
          <div className="glass-panel rounded-2xl p-8 border border-white/5">
            <h2 className="text-xl font-bold mb-4 text-white">Getting Started</h2>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mr-3 text-xs font-mono">1</span>
                <p>Connect your wallet using the button in the header</p>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mr-3 text-xs font-mono">2</span>
                <p>Browse the Marketplace specifically curated for crypto enthusiasts</p>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mr-3 text-xs font-mono">3</span>
                <p>Flash your NFT Ticket at the gate to enter</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-16">
        <div className={`container mx-auto px-4 py-8 text-center text-gray-600 text-sm ${!isConnected ? 'max-w-4xl' : ''}`}>
          <p>Built with <span className="text-purple-500/50">EntryX</span> on XRPL</p>
        </div>
      </footer>
    </div>
  );
}
