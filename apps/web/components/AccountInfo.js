"use client";

import { useWallet } from "./providers/WalletProvider";

export function AccountInfo() {
  const { isConnected, accountInfo } = useWallet();

  if (!isConnected || !accountInfo) {
    return null;
  }

  return (
    <div className="glass-card p-6 rounded-2xl border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)] h-full">
      <h2 className="text-xl font-bold mb-6 text-white tracking-tight">Account Info</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
          <span className="text-sm font-medium text-gray-400">Address:</span>
          <span className="text-sm font-mono text-white truncate ml-4">{accountInfo.address}</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
          <span className="text-sm font-medium text-gray-400">Network:</span>
          <span className="text-sm text-white capitalize">{accountInfo.network}</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
          <span className="text-sm font-medium text-gray-400">Wallet:</span>
          <span className="text-sm text-white font-bold">{accountInfo.walletName}</span>
        </div>
      </div>
      <p className="mt-6 text-xs text-gray-500 text-center italic">
        Connected via Crossmark • Secure Session
      </p>
    </div>
  );
}
