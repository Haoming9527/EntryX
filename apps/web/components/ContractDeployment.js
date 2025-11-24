"use client";

import { useState } from "react";
import { useWallet } from "./providers/WalletProvider";

export function ContractDeployment() {
  const { walletManager, isConnected, addEvent, showStatus } = useWallet();
  const [wasmFile, setWasmFile] = useState(null);
  const [wasmHex, setWasmHex] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setWasmFile(file);
      setDeployResult(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const bytes = new Uint8Array(arrayBuffer);
        const hex = Array.from(bytes)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
          .toUpperCase();
        setWasmHex(hex);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDeploy = async () => {
    if (!walletManager || !walletManager.account) {
      showStatus("Please connect a wallet first", "error");
      return;
    }

    if (!wasmHex) {
      showStatus("Please upload a WASM file first", "error");
      return;
    }

    try {
      setIsDeploying(true);
      setDeployResult(null);

      const transaction = {
        TransactionType: "ContractCreate",
        Account: walletManager.account.address,
        Fee: "100000000", // 100 XRP in drops
        ContractCode: wasmHex,
      };

      const txResult = await walletManager.signAndSubmit(transaction);

      setDeployResult({
        success: true,
        hash: txResult.hash || "Pending",
        id: txResult.id,
      });

      showStatus("Contract deployed successfully!", "success");
      addEvent("Contract Deployed", txResult);
    } catch (error) {
      setDeployResult({
        success: false,
        error: error.message,
      });
      showStatus(`Deployment failed: ${error.message}`, "error");
      addEvent("Contract Deployment Failed", error);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Deploy Contract</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload WASM File
          </label>
          <input
            type="file"
            accept=".wasm"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent/90"
          />
          {wasmFile && (
            <div className="mt-2 text-sm text-gray-600">
              Selected: {wasmFile.name} ({(wasmFile.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>

        {wasmHex && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contract Code (Hex)
            </label>
            <textarea
              value={wasmHex}
              readOnly
              className="w-full h-32 p-3 bg-gray-50 rounded-lg font-mono text-xs"
            />
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          <strong>Note:</strong> Contract deployment requires 100 XRP as fee. Make sure you have
          sufficient balance.
        </div>

        {isConnected && wasmHex && (
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="w-full bg-accent text-white py-2 px-4 rounded-lg font-semibold hover:bg-accent/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isDeploying ? "Deploying Contract..." : "Deploy Contract"}
          </button>
        )}

        {!isConnected && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <strong>Connect your wallet</strong> to deploy contracts
          </div>
        )}

        {deployResult && (
          <div
            className={`p-4 rounded-lg ${
              deployResult.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {deployResult.success ? (
              <>
                <h3 className="font-bold text-green-800 mb-2">Contract Deployed!</h3>
                <p className="text-sm text-green-700">
                  <strong>Hash:</strong> {deployResult.hash}
                </p>
                {deployResult.id && (
                  <p className="text-sm text-green-700">
                    <strong>ID:</strong> {deployResult.id}
                  </p>
                )}
                <p className="text-xs text-green-600 mt-2">
                  ✅ Contract has been deployed to the ledger
                </p>
              </>
            ) : (
              <>
                <h3 className="font-bold text-red-800 mb-2">Deployment Failed</h3>
                <p className="text-sm text-red-700">{deployResult.error}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
