import { Client } from "xrpl";

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
  const { convertStringToHex } = await import("xrpl");
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

export const buyTicketWithRlusd = async (walletManager, address, metadata, amount) => {
  const RLUSD_ISSUER = process.env.NEXT_PUBLIC_RLUSD_ISSUER;
  const RLUSD_CURRENCY = process.env.NEXT_PUBLIC_RLUSD_CURRENCY;
  const TREASURY_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;

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

  const paymentResult = await walletManager.signAndSubmit(paymentTransaction);
  return await mintNft(walletManager, address, metadata);
};
