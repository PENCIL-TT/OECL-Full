
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  DollarSign, 
  Plus, 
  Download,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PaymentsPage = () => {
  // Mock data for invoices
  const invoices = [
    { id: "INV-2023-001", amount: 1250.00, date: "2023-10-05", dueDate: "2023-11-05", status: "paid", shipment: "SH-2023-001" },
    { id: "INV-2023-002", amount: 850.50, date: "2023-10-10", dueDate: "2023-11-10", status: "pending", shipment: "SH-2023-002" },
    { id: "INV-2023-003", amount: 1750.00, date: "2023-10-15", dueDate: "2023-11-15", status: "overdue", shipment: "SH-2023-003" },
    { id: "INV-2023-004", amount: 950.75, date: "2023-10-20", dueDate: "2023-11-20", status: "pending", shipment: "SH-2023-004" },
    { id: "INV-2023-005", amount: 1500.00, date: "2023-09-25", dueDate: "2023-10-25", status: "paid", shipment: "SH-2023-005" }
  ];

  // Mock data for payment methods
  const paymentMethods = [
    { id: "PM-001", type: "credit_card", last4: "4242", expiry: "05/25", default: true },
    { id: "PM-002", type: "bank_account", accountNumber: "****6789", bankName: "Chase", default: false }
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "overdue":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-kargon-dark">Payments</h1>
        <Button className="bg-kargon-red hover:bg-kargon-red/90">
          <DollarSign className="mr-2 h-4 w-4" /> Make Payment
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,750.00</div>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Outstanding</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,601.25</div>
            <p className="text-xs text-gray-500 mt-1">Across 3 invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Next Payment Due</CardTitle>
            <Clock className="h-4 w-4 text-kargon-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Oct 25, 2023</div>
            <p className="text-xs text-gray-500 mt-1">INV-2023-002 ($850.50)</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoices" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Invoice History</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" /> View Statement
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Shipment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(invoice.status)}
                            <Badge variant="outline" className={getStatusBadgeColor(invoice.status)}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{invoice.shipment}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="methods" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your saved payment methods</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Payment Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {method.type === 'credit_card' ? (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-blue-600" />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {method.type === 'credit_card' 
                                ? `Credit Card ending in ${method.last4}` 
                                : `Bank Account (${method.bankName})`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {method.type === 'credit_card' 
                                ? `Expires ${method.expiry}` 
                                : `Account ending in ${method.accountNumber}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {method.default && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                              Default
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentsPage;
