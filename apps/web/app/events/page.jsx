"use client";

import React, { useState } from 'react';
import { useWallet } from "../../components/providers/WalletProvider";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/Header";

export default function Events() {
  const { walletManager, isConnected, accountInfo } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  // Mock Data for Visuals
  const mockEvents = [
    { id: '1', title: 'Neon Nights 2026', date: '2026-08-15', price: '50 RLUSD', image: 'https://images.unsplash.com/photo-1470229722913-7ea251b94d4b?auto=format&fit=crop&q=80&w=1000' },
    { id: '2', title: 'Tech Summit SG', date: '2026-09-20', price: '120 RLUSD', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000' },
  ];

  const handleBuy = async (evt) => {
    if (!isConnected || !walletManager || !accountInfo) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      setIsLoading(true);
      // Construct Payment Transaction (Simulating RLUSD payment)
      const transaction = {
        TransactionType: 'Payment',
        Account: accountInfo.address,
        Destination: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe', // Example Issuer/Organizer Address
        Amount: '1000000', // 1 XRP (Simulating Price)
      };

      const result = await walletManager.sign(transaction);
      console.log('Purchase Result:', result);
      alert(`Successfully purchased ticket for ${evt.title}!`);
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed. See console.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Upcoming Events</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((evt) => (
            <Card key={evt.id} hover className="overflow-hidden p-0 bg-white border-none">
              <div className="h-48 w-full relative">
                <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-mono border border-gray-200">
                  NFT Ticket
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-sm text-blue-600 font-medium mb-2">{evt.date}</div>
                <h3 className="text-xl font-bold mb-2">{evt.title}</h3>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-lg font-bold">{evt.price}</span>
                  <Button size="sm" onClick={() => handleBuy(evt)}>Buy Ticket</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
