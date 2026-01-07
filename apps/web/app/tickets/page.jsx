"use client";

import React, { useState, useEffect } from 'react';
import { useWallet } from "../../components/providers/WalletProvider";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export default function MyTickets() {
  const { isConnected, accountInfo, walletManager, showStatus } = useWallet();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isBurning, setIsBurning] = useState(null);

  const fetchTickets = async () => {
    if (isConnected && accountInfo?.address) {
      setIsLoading(true);
      try {
        const { getAccountNfts } = await import("../../lib/xrpl");
        const nfts = await getAccountNfts(accountInfo.address);
        
        const parsedTickets = nfts.map(nft => {
          let metadata = { name: "Unknown Ticket", description: "No metadata", image: "https://via.placeholder.com/400" };
          try {
            if (nft.URI) {
              const decoded = Buffer.from(nft.URI, 'hex').toString('utf8');
              if (decoded.startsWith('{')) {
                 metadata = JSON.parse(decoded);
              }
            }
          } catch (e) {
            console.log("Failed to parse URI", e);
          }

          return {
            id: nft.NFTokenID,
            tokenId: nft.NFTokenID,
            issuer: nft.Issuer,
            ...metadata 
          };
        });

        setTickets(parsedTickets);
      } catch (error) {
        console.error("Error loading tickets:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [isConnected, accountInfo]);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
        setIsVerifying(false);
        alert("Ticket Verified! Access Granted.");
        setSelectedTicket(null);
    }, 2000);
  };

  const handleBurn = async (ticketId) => {
    if (!window.confirm("Are you sure you want to PERMANENTLY burn this ticket? This cannot be undone.")) {
      return;
    }

    try {
      setIsBurning(ticketId);
      const { burnNft } = await import("../../lib/xrpl");
      const result = await burnNft(walletManager, accountInfo.address, ticketId);
      console.log("Burn Result:", result);
      
      showStatus("Ticket Burned Successfully", "success");
      await fetchTickets();
    } catch (error) {
      console.error("Burn failed:", error);
      showStatus("Burn failed: " + error.message, "error");
    } finally {
      setIsBurning(null);
    }
  };

  return (
    <div className="min-h-screen">
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-white">My Tickets</h1>

        {!isConnected ? (
           <div className="text-center py-20 p-8 glass-panel rounded-3xl">
              <p className="text-xl text-gray-400 mb-4">Connect your wallet to view your tickets.</p>
           </div>
        ) : isLoading && tickets.length === 0 ? (
           <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
           </div>
        ) : tickets.length === 0 ? (
           <div className="text-center py-20 p-8 glass-panel rounded-3xl">
             <p className="text-xl text-gray-400 mb-6">No tickets found in your wallet.</p>
             <a href="/events" className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all">
                Browse Events →
             </a>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="border-0 bg-opacity-40 flex flex-col">
                 <div className="h-48 w-full relative">
                    <img 
                      src={ticket.image || ticket.imageUrl || "https://via.placeholder.com/400"} 
                      alt={ticket.name || ticket.title} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {e.target.src = "https://via.placeholder.com/400?text=No+Image"}}
                    />
                    <div className="absolute top-0 right-0 p-3">
                        <div className="bg-green-500/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono text-green-400 border border-green-500/30">
                        OWNED
                        </div>
                    </div>
                 </div>
                 <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-1 text-white truncate">{ticket.name || ticket.title || "Untitled Ticket"}</h3>
                    <p className="text-purple-400 text-sm mb-4">{ticket.date || "Date TBA"}</p>
                    <p className="text-xs text-gray-500 font-mono mb-6 truncate relative group cursor-help">
                        ID: {ticket.tokenId}
                        <span className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-full break-all z-10 border border-white/10">
                            {ticket.tokenId}
                        </span>
                    </p>
                    
                    <div className="mt-auto space-y-3">
                        <Button fullWidth onClick={() => setSelectedTicket(ticket)}>
                            Verify Entry
                        </Button>
                        <Button 
                            variant="ghost" 
                            fullWidth 
                            className="bg-red-500/5 hover:bg-red-500/10 text-red-400/70 hover:text-red-400 text-xs py-2"
                            onClick={() => handleBurn(ticket.tokenId)}
                            isLoading={isBurning === ticket.tokenId}
                        >
                            {isBurning === ticket.tokenId ? "Burning..." : "Burn Ticket"}
                        </Button>
                    </div>
                 </div>
              </Card>
            ))}
          </div>
        )}

        {/* Verification Modal */}
        {selectedTicket && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="glass-panel border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center relative shadow-2xl shadow-purple-900/50">
                    <h3 className="text-2xl font-bold mb-2 text-white">Scan to Verify</h3>
                    <p className="text-gray-400 mb-6 text-sm">Present this to the event organizer</p>
                    
                    <div className="w-56 h-56 bg-white mx-auto mb-8 rounded-2xl p-4 flex items-center justify-center">
                        {/* Placeholder QR */}
                        <div className="w-full h-full border-4 border-black border-dashed rounded-lg opacity-20"></div>
                    </div>
                    
                    <div className="space-y-3">
                        <Button 
                            fullWidth 
                            isLoading={isVerifying} 
                            onClick={handleVerify}
                            className={!isVerifying && "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500"}
                        >
                            {isVerifying ? "Verifying..." : "Simulate Scan"}
                        </Button>
                        <Button variant="ghost" fullWidth onClick={() => setSelectedTicket(null)}>
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}
