"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

const WalletContext = createContext(undefined);

export function WalletProvider({ children }) {
  const [walletManager, setWalletManagerState] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const [events, setEvents] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);


  const [isInitializing, setIsInitializing] = useState(true);

  // Helper to update state based on manager
  const updateConnectionState = useCallback((manager) => {
    const connected = manager.connected;
    setIsConnected(connected);

    if (connected) {
      const account = manager.account;
      const wallet = manager.wallet;

      if (account && wallet) {
        setAccountInfo({
          address: account.address,
          network: `${account.network.name} (${account.network.id})`,
          walletName: wallet.name,
        });
      }
      setIsInitializing(false); // Stop initializing once connected
    } else {
      setAccountInfo(null);
    }
  }, []);

  const setWalletManagerCallback = useCallback((manager) => {
    setWalletManagerState(manager);
  }, []);

  const addEvent = useCallback((name, data) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents((prev) => [{ timestamp, name, data }, ...prev]);
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const showStatus = useCallback((message, type) => {
    setStatusMessage({ message, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 5000);
  }, []);

  // Initialize Wallet Manager
  useEffect(() => {
    const initWalletManager = async () => {
      if (walletManager) return; // Prevent double init

      try {
        const {
          WalletManager,
          CrossmarkAdapter,
          GemWalletAdapter,
        } = await import("xrpl-connect");

        const adapters = [
            new CrossmarkAdapter(),
            new GemWalletAdapter()
        ];

        const manager = new WalletManager({
          adapters,
          network: "testnet",
          autoConnect: true,
          logger: { level: "info" },
        });

        setWalletManagerState(manager);

        manager.on("connect", (account) => {
          addEvent("Connected", account);
          updateConnectionState(manager);
        });

        manager.on("disconnect", () => {
          addEvent("Disconnected", null);
          updateConnectionState(manager);
        });

        manager.on("error", (error) => {
          addEvent("Error", error);
          showStatus(error.message, "error");
        });

        // Check if already connected (autoConnect)
        if (manager.connected) {
            console.log("Wallet already connected (autoConnect)");
            updateConnectionState(manager);
            setIsInitializing(false);
        }
        
        // Polling check for connection (fixes race conditions with slow-injecting wallets like Crossmark)
        const checkConnection = setInterval(() => {
            if (manager.connected) {
                console.log("Wallet connected (detected via polling)");
                updateConnectionState(manager);
                showStatus("Wallet Reconnected", "success");
                setIsInitializing(false);
                clearInterval(checkConnection);
            }
        }, 500);

        // Stop polling after 5 seconds to prevent eternal checking
        setTimeout(() => {
            clearInterval(checkConnection);
            setIsInitializing(false); // Stop initializing even if not connected after timeout
        }, 5000);

        console.log("XRPL Connect initialized via Provider");
      } catch (error) {
        console.error("Failed to initialize wallet manager:", error);
        showStatus("Failed to initialize wallet connection", "error");
        setIsInitializing(false);
      }
    };

    initWalletManager();
  }, [walletManager, addEvent, showStatus, updateConnectionState]);

  return (
    <WalletContext.Provider
      value={{
        walletManager,
        isConnected,
        isInitializing, // Expose this
        accountInfo,
        events,
        statusMessage,
        setWalletManager: setWalletManagerCallback,
        setIsConnected,
        setAccountInfo,
        addEvent,
        clearEvents,
        showStatus,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
