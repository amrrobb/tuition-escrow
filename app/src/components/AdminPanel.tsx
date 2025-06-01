
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Shield, CheckCircle, XCircle, Clock, University, User, DollarSign } from 'lucide-react';

interface PendingPayment {
  id: string;
  payer: string;
  university: string;
  universityName: string;
  amount: string;
  invoiceRef: string;
  description?: string;
  timestamp: string;
  status: 'pending' | 'released' | 'refunded';
}

const mockPendingPayments: PendingPayment[] = [
  {
    id: '1',
    payer: '0x742d35Cc5323d8C2c53F3B8aC2F6B8ec3A3b8d6c',
    university: '0x1234567890123456789012345678901234567890',
    universityName: 'Massachusetts Institute of Technology',
    amount: '5000.00',
    invoiceRef: 'INV-2024-001',
    description: 'Spring 2024 Tuition Fee',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'pending'
  },
  {
    id: '2',
    payer: '0x123d35Cc5323d8C2c53F3B8aC2F6B8ec3A3b8d6c',
    university: '0x2345678901234567890123456789012345678901',
    universityName: 'University of Oxford',
    amount: '8500.00',
    invoiceRef: 'INV-2024-002',
    description: 'Fall 2024 Tuition and Accommodation',
    timestamp: '2024-01-14T14:20:00Z',
    status: 'pending'
  },
  {
    id: '3',
    payer: '0x456d35Cc5323d8C2c53F3B8aC2F6B8ec3A3b8d6c',
    university: '0x3456789012345678901234567890123456789012',
    universityName: 'University of Tokyo',
    amount: '3200.00',
    invoiceRef: 'INV-2024-003',
    timestamp: '2024-01-13T09:15:00Z',
    status: 'released'
  }
];

export const AdminPanel = () => {
  const [payments, setPayments] = useState<PendingPayment[]>(mockPendingPayments);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleRelease = async (paymentId: string) => {
    setIsLoading(paymentId);
    try {
      // Simulate smart contract interaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPayments(prev => prev.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'released' as const }
          : payment
      ));

      const payment = payments.find(p => p.id === paymentId);
      toast({
        title: "Payment Released",
        description: `${payment?.amount} USDC has been released to ${payment?.universityName}`,
      });
    } catch (error) {
      toast({
        title: "Release Failed",
        description: "Failed to release payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleRefund = async (paymentId: string) => {
    setIsLoading(paymentId);
    try {
      // Simulate smart contract interaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPayments(prev => prev.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'refunded' as const }
          : payment
      ));

      const payment = payments.find(p => p.id === paymentId);
      toast({
        title: "Payment Refunded",
        description: `${payment?.amount} USDC has been refunded to the payer`,
      });
    } catch (error) {
      toast({
        title: "Refund Failed",
        description: "Failed to refund payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'released':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Released</Badge>;
      case 'refunded':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const completedPayments = payments.filter(p => p.status !== 'pending');

  const totalPending = pendingPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
  const totalProcessed = completedPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Admin Panel</span>
          </CardTitle>
          <CardDescription>
            Manage pending payments and escrow releases
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold">{pendingPayments.length}</p>
                <p className="text-sm text-gray-500">${totalPending.toLocaleString()} USDC</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Processed</p>
                <p className="text-2xl font-bold">{completedPayments.length}</p>
                <p className="text-sm text-gray-500">${totalProcessed.toLocaleString()} USDC</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold">{payments.length}</p>
                <p className="text-sm text-gray-500">${(totalPending + totalProcessed).toLocaleString()} USDC</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingPayments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedPayments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingPayments.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pending payments</p>
              </CardContent>
            </Card>
          ) : (
            pendingPayments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-lg">{payment.invoiceRef}</h3>
                        {getStatusBadge(payment.status)}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <University className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">University:</span>
                            <span>{payment.universityName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Payer:</span>
                            <code className="bg-gray-100 px-1 rounded">{formatAddress(payment.payer)}</code>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Amount:</span>
                            <span className="font-bold text-green-600">{payment.amount} USDC</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-gray-600">Date:</span>
                            <p>{formatDate(payment.timestamp)}</p>
                          </div>
                          {payment.description && (
                            <div>
                              <span className="font-medium text-gray-600">Description:</span>
                              <p className="text-gray-700">{payment.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        onClick={() => handleRelease(payment.id)}
                        disabled={isLoading === payment.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {isLoading === payment.id ? 'Releasing...' : 'Release'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRefund(payment.id)}
                        disabled={isLoading === payment.id}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        {isLoading === payment.id ? 'Refunding...' : 'Refund'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedPayments.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No completed payments</p>
              </CardContent>
            </Card>
          ) : (
            completedPayments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-lg">{payment.invoiceRef}</h3>
                        {getStatusBadge(payment.status)}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <University className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">University:</span>
                            <span>{payment.universityName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Payer:</span>
                            <code className="bg-gray-100 px-1 rounded">{formatAddress(payment.payer)}</code>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Amount:</span>
                            <span className="font-bold text-green-600">{payment.amount} USDC</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-gray-600">Date:</span>
                            <p>{formatDate(payment.timestamp)}</p>
                          </div>
                          {payment.description && (
                            <div>
                              <span className="font-medium text-gray-600">Description:</span>
                              <p className="text-gray-700">{payment.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
