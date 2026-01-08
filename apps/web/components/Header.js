import Link from "next/link";
import { WalletConnector } from "./WalletConnector";
import { useWallet } from "./providers/WalletProvider";

export function Header() {
  const { statusMessage } = useWallet();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5">
      <div className="absolute inset-0 glass-panel -z-10 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <img 
                src="/logo.png" 
                alt="EntryX Logo" 
                className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(34,197,94,0.4)] group-hover:scale-105 transition-all"
              />
              <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-purple-600 pb-2 pt-1">
                EntryX
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              <NavLink href="/events">Events</NavLink>
              <NavLink href="/tickets">My Tickets</NavLink>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {statusMessage && (
              <div
                className={`text-sm px-3 py-1 rounded-full border ${
                  statusMessage.type === "success"
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : statusMessage.type === "error"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}
              >
                {statusMessage.message}
              </div>
            )}
            <WalletConnector />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }) {
  return (
    <Link 
      href={href} 
      className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
    >
      {children}
    </Link>
  );
}
