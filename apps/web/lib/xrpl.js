import { Client, convertStringToHex } from "xrpl";

const XRPL_RPC_URL = process.env.NEXT_PUBLIC_XRPL_RPC_URL;

let client = null;

export const getXrplClient = async () => {
  if (!client) {
    client = new Client(XRPL_RPC_URL);
    await client.connect();
  }
  
  if (!client.isConnected()) {
    await client.connect();
  }
  
  return client;
};

export const getAccountNfts = async (address) => {
  try {
    const client = await getXrplClient();
    const response = await client.request({
      command: "account_nfts",
      account: address,
    });
    return response.result.account_nfts;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
};

export const burnNft = async (walletManager, address, nftTokenId) => {
  const transaction = {
    TransactionType: "NFTokenBurn",
    Account: address,
    NFTokenID: nftTokenId,
  };

  return await walletManager.signAndSubmit(transaction);
};

export const mintNft = async (walletManager, address, metadata) => {
  const uri = convertStringToHex(JSON.stringify(metadata));

  const transaction = {
    TransactionType: 'NFTokenMint',
    Account: address,
    URI: uri,
    Flags: 8, // tfTransferable
    NFTokenTaxon: 0, 
  };

  return await walletManager.signAndSubmit(transaction);
};

export const buyTicketWithRlusd = async (walletManager, address, metadata, amount, onProgress) => {
  const RLUSD_ISSUER = process.env.NEXT_PUBLIC_RLUSD_ISSUER;
  const RLUSD_CURRENCY = process.env.NEXT_PUBLIC_RLUSD_CURRENCY;
  const TREASURY_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;

  console.log("Preparing RLUSD Payment:", {
    amount,
    destination: TREASURY_ADDRESS,
    issuer: RLUSD_ISSUER
  });

  const paymentTransaction = {
    TransactionType: "Payment",
    Account: address,
    Destination: TREASURY_ADDRESS,
    Amount: {
      currency: RLUSD_CURRENCY,
      issuer: RLUSD_ISSUER,
      value: amount,
    },
  };

  try {
    if (onProgress) onProgress("Step 1/2: Processing RLUSD Payment...");
    const paymentResult = await walletManager.signAndSubmit(paymentTransaction);
    console.log("Payment successful, now minting NFT...", paymentResult);
    
    if (onProgress) onProgress("Step 2/2: Minting your Ticket NFT...");
    return await mintNft(walletManager, address, metadata);
  } catch (error) {
    console.error("Payment or Minting failed:", error);
    throw error;
  }
};
