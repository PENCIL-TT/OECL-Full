
import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  CreditCard, 
  Download, 
  Eye,
  BarChart
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Payment {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  transaction_id: string | null;
  profiles: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

const PaymentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('payments')
          .select(`
            id,
            amount,
            status,
            payment_method,
            created_at,
            transaction_id,
            profiles:user_id (
              email,
              first_name,
              last_name
            )
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setPayments(data || []);
      } catch (err: any) {
        console.error('Error fetching payments:', err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPayments();
  }, []);
  
  const filteredPayments = payments.filter(payment => 
    payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (payment.profiles?.email && payment.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed": return "default";
      case "Pending": return "secondary";
      case "Failed": return "destructive";
      default: return "outline";
    }
  };

  const getCustomerName = (payment: Payment) => {
    if (!payment.profiles) return "Unknown";
    
    const firstName = payment.profiles.first_name || "";
    const lastName = payment.profiles.last_name || "";
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    
    return payment.profiles.email;
  };

  // Calculate summary statistics
  const totalRevenue = payments.reduce((sum, payment) => 
    payment.status === "Completed" ? sum + Number(payment.amount) : sum, 0
  );
  
  const pendingRevenue = payments.reduce((sum, payment) => 
    payment.status === "Pending" ? sum + Number(payment.amount) : sum, 0
  );
  
  const failedRevenue = payments.reduce((sum, payment) => 
    payment.status === "Failed" ? sum + Number(payment.amount) : sum, 0
  );
  
  const completedCount = payments.filter(payment => payment.status === "Completed").length;
  const pendingCount = payments.filter(payment => payment.status === "Pending").length;
  const failedCount = payments.filter(payment => payment.status === "Failed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">payments Management</h1>
        <p className="text-muted-foreground">Track and manage all payment transactions</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${isLoading ? '...' : totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{isLoading ? '...' : completedCount} successful transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${isLoading ? '...' : pendingRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{isLoading ? '...' : pendingCount} pending transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${isLoading ? '...' : failedRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{isLoading ? '...' : failedCount} failed transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : 
                payments.length > 0 
                  ? `${((completedCount / payments.length) * 100).toFixed(1)}%` 
                  : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">Based on all transactions</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search payments..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        {isLoading ? (
          <div className="p-8 text-center">Loading payments...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Error: {error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.transaction_id || payment.id.slice(0, 8)}</TableCell>
                    <TableCell>{getCustomerName(payment)}</TableCell>
                    <TableCell>${Number(payment.amount).toFixed(2)}</TableCell>
                    <TableCell>{payment.payment_method}</TableCell>
                    <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No payments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default PaymentsManagement;
