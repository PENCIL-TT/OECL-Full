
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Filter,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ShipmentsPage = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Mock data for shipments
  const shipments = [
    { id: "SH-2023-001", origin: "New York, USA", destination: "London, UK", status: "in-transit", date: "2023-10-15", customer: "ABC Corp" },
    { id: "SH-2023-002", origin: "Berlin, Germany", destination: "Paris, France", status: "delivered", date: "2023-10-10", customer: "Global Trade Ltd" },
    { id: "SH-2023-003", origin: "Tokyo, Japan", destination: "Seoul, South Korea", status: "pending", date: "2023-10-18", customer: "Nippon Exports" },
    { id: "SH-2023-004", origin: "Sydney, Australia", destination: "Melbourne, Australia", status: "in-transit", date: "2023-10-14", customer: "Oceanic Shipping" },
    { id: "SH-2023-005", origin: "Dubai, UAE", destination: "Mumbai, India", status: "pending", date: "2023-10-20", customer: "Desert Traders" },
    { id: "SH-2023-006", origin: "Los Angeles, USA", destination: "Vancouver, Canada", status: "delivered", date: "2023-10-08", customer: "Pacific Routes" },
    { id: "SH-2023-007", origin: "Amsterdam, Netherlands", destination: "Brussels, Belgium", status: "in-transit", date: "2023-10-17", customer: "Euro Logistics" },
    { id: "SH-2023-008", origin: "Singapore", destination: "Jakarta, Indonesia", status: "pending", date: "2023-10-22", customer: "ASEAN Cargo" }
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

  const filteredShipments = statusFilter === "all" 
    ? shipments 
    : shipments.filter(shipment => shipment.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-kargon-dark">Manage Shipments</h1>
        <Button className="bg-kargon-red hover:bg-kargon-red/90">
          <Plus className="mr-2 h-4 w-4" /> New Shipment
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search shipments..."
                  className="pl-8 w-full md:w-80"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.id}</TableCell>
                    <TableCell>{shipment.customer}</TableCell>
                    <TableCell>{shipment.origin}</TableCell>
                    <TableCell>{shipment.destination}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeColor(shipment.status)}>
                        {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{shipment.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentsPage;
