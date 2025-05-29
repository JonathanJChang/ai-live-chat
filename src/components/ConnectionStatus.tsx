import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className={`flex items-center gap-3 text-lg font-bold px-6 py-3 rounded-full shadow-md border-2 transition-all duration-300 ${
      isConnected 
        ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-600 border-emerald-200 animate-pulse' 
        : 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 border-rose-200'
    }`}>
      {isConnected ? (
        <>
          <Wifi size={20} />
          <span>🌟 Connected!</span>
        </>
      ) : (
        <>
          <WifiOff size={20} />
          <span>⚠️ Disconnected</span>
        </>
      )}
    </div>
  );
} 