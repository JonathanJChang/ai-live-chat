import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-full ${
      isConnected 
        ? 'bg-green-100 text-green-700' 
        : 'bg-red-100 text-red-700'
    }`}>
      {isConnected ? (
        <>
          <Wifi size={16} />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff size={16} />
          <span>Disconnected</span>
        </>
      )}
    </div>
  );
} 