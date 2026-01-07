"use client";

import React, { useState } from 'react';
import { useWallet } from "../../components/providers/WalletProvider";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/Header";
import { convertStringToHex } from 'xrpl';

export default function Dashboard() {
  const { isConnected, walletManager, accountInfo } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  
  const [eventDetails, setEventDetails] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    date: '',
  });

  const handleMint = async (e) => {
    e.preventDefault();
    if (!walletManager || !accountInfo) return;

    setIsLoading(true);
    try {
      // 1. Construct the URI (In real world, upload metadata to IPFS)
      const uri = convertStringToHex(JSON.stringify(eventDetails));

      // 2. Prepare Transaction
      const transaction = {
        TransactionType: 'NFTokenMint',
        Account: accountInfo.address,
        URI: uri,
        Flags: 8, // tfTransferable
        NFTokenTaxon: 0, 
      };

      // 3. Sign & Submit
      // The walletManager from xrpl-connect exposes .sign()
      const result = await walletManager.sign(transaction);
      console.log('Minted:', result);
      
      alert('Event Ticket Minted Successfully!');
      setEventDetails({ name: '', description: '', price: '', imageUrl: '', date: '' });
      
    } catch (error) {
      console.error('Minting failed:', error);
      alert('Minting failed. See console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <h2 className="text-2xl font-bold mb-4">Organizer Dashboard</h2>
            <p className="text-gray-400 mb-6">Please connect your wallet to mint tickets.</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
            
            <Card>
              <form onSubmit={handleMint} className="space-y-6">
                <Input 
                  label="Event Name" 
                  placeholder="e.g. Summer Music Festival 2026"
                  value={eventDetails.name}
                  onChange={(e) => setEventDetails({...eventDetails, name: e.target.value})}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                   <Input 
                    label="Date" 
                    type="date"
                    value={eventDetails.date}
                    onChange={(e) => setEventDetails({...eventDetails, date: e.target.value})}
                    required
                  />
                  <Input 
                    label="Price (RLUSD)" 
                    type="number"
                    placeholder="50"
                    value={eventDetails.price}
                    onChange={(e) => setEventDetails({...eventDetails, price: e.target.value})}
                    required
                  />
                </div>

                <Input 
                  label="Image URL" 
                  placeholder="https://..."
                  value={eventDetails.imageUrl}
                  onChange={(e) => setEventDetails({...eventDetails, imageUrl: e.target.value})}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors h-32 resize-none"
                    placeholder="Enter event details..."
                    value={eventDetails.description}
                    onChange={(e) => setEventDetails({...eventDetails, description: e.target.value})}
                    required
                  />
                </div>

                <Button type="submit" isLoading={isLoading} fullWidth>
                  Mint Event Tickets
                </Button>
              </form>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
