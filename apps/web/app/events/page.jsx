"use client";

import React, { useState } from 'react';
import { useWallet } from "../../components/providers/WalletProvider";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export default function Events() {
  const { walletManager, isConnected, accountInfo, showStatus } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState("");

  const mockEvents = [
    { 
        id: '1', 
        title: 'Neon Nights 2026', 
        date: '2026-08-15', 
        price: '0.1 RLUSD',
        description: 'An electrifying night of synthwave and cyber-aesthetics.',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000' 
    },
    { 
        id: '2', 
        title: 'Future Tech Summit', 
        date: '2026-09-20', 
        price: '0.2 RLUSD', 
        description: 'Join the leaders of tomorrow at the biggest tech conference in Asia.',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1000' 
    },
    { 
        id: '3', 
        title: 'Abstract Art Expo', 
        date: '2026-10-05', 
        price: '0.1 RLUSD', 
        description: 'A showcase of modern digital art and NFTs.',
        image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&q=80&w=1000' 
    },
    { 
        id: '4', 
        title: 'Crypto Gaming Championship', 
        date: '2026-11-12', 
        price: '0.1 RLUSD', 
        description: 'Witness the finals of the global Web3 gaming tournament.',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000' 
    },
    { 
        id: '5', 
        title: 'Sustainable Energy Forum', 
        date: '2026-12-01', 
        price: '0.3 RLUSD', 
        description: 'Discussing the green future of blockchain technology.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000' 
    },
    { 
        id: '6', 
        title: 'Underground Music Fest', 
        date: '2027-01-20', 
        price: '0.1 RLUSD', 
        description: 'Discover the best emerging indie bands.',
        image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=1000' 
    }
  ];

  const handleBuy = async (evt) => {
    if (!isConnected || !walletManager || !accountInfo) {
      showStatus("Please connect your wallet first", "error");
      return;
    }

    try {
      setIsLoading(true);
      const { buyTicketWithRlusd } = await import("../../lib/xrpl");
      
      const amount = evt.price.split(' ')[0];

      const result = await buyTicketWithRlusd(
        walletManager, 
        accountInfo.address, 
        {
          name: evt.title,
          description: evt.description,
          image: evt.image,
          date: evt.date,
          price: evt.price
        }, 
        amount,
        (status) => {
          setPurchaseStatus(status);
          showStatus(status, "info");
        }
      );

      console.log('Purchase Result:', result);
      showStatus(`Successfully purchased ticket for ${evt.title}!`, "success");
    } catch (error) {
      console.error("Purchase failed:", error);
      showStatus("Purchase failed: " + (error.message || "Unknown error"), "error");
    } finally {
      setIsLoading(false);
      setPurchaseStatus("");
    }
  };

  return (
    <div className="min-h-screen">
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">Upcoming Events</h1>
          <div className="text-sm text-gray-500 font-mono">LIVE ON TESTNET</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((evt) => (
            <Card key={evt.id} hover className="border-0 bg-opacity-40">
              <div className="h-48 w-full relative">
                <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                <div className="absolute top-0 right-0 p-4">
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono text-white border border-white/10">
                    NFT Ticket
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-16">
                     <div className="text-sm text-purple-400 font-bold mb-1 uppercase tracking-wider">{evt.date}</div>
                     <h3 className="text-xl font-bold text-white">{evt.title}</h3>
                </div>
              </div>
              
              <div className="p-6 pt-4">
                <p className="text-gray-400 text-sm mb-6 line-clamp-2 min-h-[40px]">{evt.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-white">{evt.price}</span>
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
