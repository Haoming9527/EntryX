# EntryX 🎫🚀

**EntryX** is a next-generation tokenized ticketing platform built on the **XRP Ledger (XRPL)**. This project was developed for the **[NUS FinTech Summit 2026](https://nusfintechsummit.com/)** to demonstrate the power of stablecoins (RLUSD) and NFTs in creating a secure, verifiable, and seamless event experience.

## 🌟 Features

- **RLUSD Payments**: Secure ticket purchases using the Ripple USD (RLUSD) stablecoin on Testnet.
- **NFT Tickets (NFTokenMint)**: Every ticket is a unique NFT, minted directly to the user's wallet upon purchase.
- **On-Chain Verification**: Simple "Scan and Verify" flow for event organizers.
- **Modern Dark UI**: A premium, "Neon-Dark" aesthetic (Green & Purple) designed for high-end FinTech applications.
- **Wallet Integration**: Native support for **Xaman (Xumm)**, **Crossmark**, and **GemWallet**.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- An XRPL Testnet wallet with RLUSD (Get yours at the [XRPL Faucet](https://faucet.altnet.rippletest.net/))

### Installation
```bash
# Clone the repository
git clone https://github.com/your-repo/EntryX.git
cd EntryX

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

Create a `.env` file in `apps/web/` with the following Testnet settings:

```env
# Network
NEXT_PUBLIC_DEFAULT_NETWORK=testnet
NEXT_PUBLIC_XRPL_RPC_URL=wss://s.altnet.rippletest.net:51233

# RLUSD Details (Testnet Issuer)
NEXT_PUBLIC_RLUSD_ISSUER=rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV
NEXT_PUBLIC_RLUSD_CURRENCY=524C555344000000000000000000000000000000

# EntryX Treasury
NEXT_PUBLIC_TREASURY_ADDRESS=
```

> [!NOTE]
> On Testnet, set the Treasury address to the wallet address used to receive payments.

## 🛠️ Project Structure

```
EntryX/
├── apps/
│   └── web/                 # Next.js 14 Application
│       ├── app/             # Marketplace & My Tickets
│       ├── components/      # UI & Wallet Connectors
│       └── lib/             # XRPL & RLUSD Logic
├── packages/
│   └── bedrock/             # Smart contract experiments
└── package.json
```

## 🏗️ Technologies

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [React 18](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Blockchain**: [xrpl.js](https://js.xrpl.org/), [xrpl-connect](https://github.com/scaffold-xrp/xrpl-connect)
- **Monorepo**: [Turborepo](https://turbo.build/)

## 🎓 About

EntryX is developed for the NUS FinTech Summit 2026. It tackles real-world ticketing issues like scalping and fraud by leveraging the speed, transparency, and security of the XRP Ledger. By tokenizing tickets and enabling wallet-based payments with XRPL Connect, EntryX ensures verifiable ownership, trustless transactions, and seamless entry verification for both organizers and attendees.

---
Built with 💜 for the FinTech Community.
