
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Shield, CheckCircle, RefreshCw } from 'lucide-react';

export const HowItWorks = () => {
  return (
    <Card className="border border-silver-200 dark:border-gray-700 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          How it Works
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start space-x-4 group hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 rounded-lg transition-all duration-200">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-200">
              1
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100">Secure Deposit</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Your USDC is deposited into a secure escrow smart contract</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" />
          </div>
          
          <div className="flex items-start space-x-4 group hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 rounded-lg transition-all duration-200">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-200">
              2
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100">University Review</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">The university reviews and verifies your payment details</p>
            </div>
            <CheckCircle className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-200" />
          </div>
          
          <div className="flex items-start space-x-4 group hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 rounded-lg transition-all duration-200">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-200">
              3
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100">Automatic Release</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Funds are either released to the university or refunded to you</p>
            </div>
            <RefreshCw className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
