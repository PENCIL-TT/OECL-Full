
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Clock, 
  Truck, 
  Search,
  FileText,
  Plus,
  ChevronRight
} from "lucide-react";

const OverviewPage = () => {
  // Mock data for shipments
  const recentShipments = [
    { id: "SH-2023-001", origin: "New York, USA", destination: "London, UK", status: "in-transit", date: "2023-10-15" },
    { id: "SH-2023-002", origin: "Berlin, Germany", destination: "Paris, France", status: "delivered", date: "2023-10-10" },
    { id: "SH-2023-003", origin: "Tokyo, Japan", destination: "Seoul, South Korea", status: "pending", date: "2023-10-18" },
    { id: "SH-2023-004", origin: "Sydney, Australia", destination: "Melbourne, Australia", status: "in-transit", date: "2023-10-14" }
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "in-transit":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-kargon-dark">Dashboard Overview</h1>
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Search shipments..." 
            className="max-w-xs"
          />
          <Button size="icon" variant="ghost">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Shipments</CardTitle>
            <Package className="h-4 w-4 text-kargon-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-gray-500 mt-1">+14% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Shipments</CardTitle>
            <Truck className="h-4 w-4 text-kargon-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500 mt-1">5 arriving today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-kargon-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500 mt-1">Require your attention</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Shipments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Shipments</CardTitle>
          <Button variant="ghost" size="sm" className="text-kargon-red">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking ID</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentShipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">{shipment.id}</TableCell>
                  <TableCell>{shipment.origin}</TableCell>
                  <TableCell>{shipment.destination}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeColor(shipment.status)}>
                      {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{shipment.date}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Create New Shipment
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Generate Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Truck className="mr-2 h-4 w-4" /> Track Shipment
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="font-medium">Shipment SH-2023-001 is arriving today</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
              <div className="border-b pb-4">
                <p className="font-medium">New quote request submitted</p>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
              <div>
                <p className="font-medium">Your monthly report is ready</p>
                <p className="text-sm text-gray-500">3 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;
