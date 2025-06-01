
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Wallet, ChevronDown, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface WalletConnectProps {
  isConnected: boolean;
  account: string | null;
  balance: string | null;
  networkName: string | null;
  chainId: number | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onRefreshBalance: () => void;
  onSwitchToArbitrum: () => void;
  getNetworkInfo: () => { name: string; logo: string };
}

export const WalletConnect = ({ 
  isConnected, 
  account, 
  balance, 
  networkName, 
  chainId,
  onConnect, 
  onDisconnect, 
  onRefreshBalance,
  onSwitchToArbitrum,
  getNetworkInfo 
}: WalletConnectProps) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const openInExplorer = () => {
    if (account && chainId) {
      const explorerUrl = chainId === 421614 
        ? `https://sepolia.arbiscan.io/address/${account}`
        : `https://sepolia.etherscan.io/address/${account}`;
      window.open(explorerUrl, '_blank');
    }
  };

  const networkInfo = getNetworkInfo();
  const isArbitrumSepolia = chainId === 421614;

  if (!isConnected) {
    return (
      <Button 
        onClick={onConnect} 
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg"
      >
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Network Display */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-600 shadow-lg">
        {networkInfo.logo && (
          <img 
            src={networkInfo.logo} 
            alt={networkName || 'Network'} 
            className="w-5 h-5 rounded-full"
          />
        )}
        <span className="text-sm font-medium text-slate-900 dark:text-white">{networkName}</span>
        {!isArbitrumSepolia && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSwitchToArbitrum}
            className="ml-2 text-xs border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950"
          >
            Switch to Arbitrum
          </Button>
        )}
      </div>

      {/* Balance Display */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl border border-green-200 dark:border-green-800 shadow-lg">
        <span className="text-sm font-medium text-green-800 dark:text-green-200">{balance || '0.0000'} ETH</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefreshBalance}
          className="p-1 h-auto hover:bg-green-100 dark:hover:bg-green-900"
        >
          <RefreshCw className="h-3 w-3 text-green-600 dark:text-green-400" />
        </Button>
      </div>

      {/* Wallet Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border-slate-200 dark:border-slate-600 shadow-lg hover:bg-white dark:hover:bg-slate-700"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-900 dark:text-white">{formatAddress(account!)}</span>
            <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-72 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-2xl"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-900 dark:text-white">Connected</span>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {networkName}
              </Badge>
            </div>
            <Card className="border-0 shadow-md bg-slate-50 dark:bg-slate-700">
              <CardContent className="p-4">
                <div className="font-mono text-xs break-all text-slate-700 dark:text-slate-300 mb-3">{account}</div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  Balance: <span className="text-green-600 dark:text-green-400">{balance || '0.0000'} ETH</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <DropdownMenuItem onClick={copyAddress} className="hover:bg-slate-50 dark:hover:bg-slate-700">
            <Copy className="h-4 w-4 mr-2" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openInExplorer} className="hover:bg-slate-50 dark:hover:bg-slate-700">
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onRefreshBalance} className="hover:bg-slate-50 dark:hover:bg-slate-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Balance
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={onDisconnect} 
            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
