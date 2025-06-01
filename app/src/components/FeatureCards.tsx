
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, DollarSign, GraduationCap } from 'lucide-react';

export const FeatureCards = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      <Card className="border border-silver-200 dark:border-gray-700 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="h-8 w-8 text-silver-300" />
          </div>
          <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Secure Escrow</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">Funds are safely held in smart contract escrow until university approval, providing complete peace of mind</p>
        </CardContent>
      </Card>
      
      <Card className="border border-silver-200 dark:border-gray-700 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <DollarSign className="h-8 w-8 text-silver-300" />
          </div>
          <CardTitle className="text-xl text-gray-900 dark:text-gray-100">USDC Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">Stable, reliable payments using USDC stablecoin for consistent value across borders</p>
        </CardContent>
      </Card>
      
      <Card className="border border-silver-200 dark:border-gray-700 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GraduationCap className="h-8 w-8 text-silver-300" />
          </div>
          <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Global Universities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">Support for international university payments with institutional verification</p>
        </CardContent>
      </Card>
    </div>
  );
};
