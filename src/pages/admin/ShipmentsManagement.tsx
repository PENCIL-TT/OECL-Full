
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
import { Search, Filter, Package, Eye, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Shipment {
  id: string;
  tracking_number: string;
  origin: string;
  destination: string;
  status: string;
  created_at: string;
  profiles: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

const ShipmentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('shipments')
          .select(`
            id,
            tracking_number,
            origin,
            destination,
            status,
            created_at,
            profiles:user_id (
              email,
              first_name,
              last_name
            )
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setShipments(data || []);
      } catch (err: any) {
        console.error('Error fetching shipments:', err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShipments();
  }, []);
  
  const filteredShipments = shipments.filter(shipment => 
    shipment.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (shipment.profiles?.email && shipment.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Delivered": return "default";
      case "In Transit": return "secondary";
      case "Processing": return "secondary";
      case "Delayed": return "destructive";
      default: return "outline";
    }
  };

  const getCustomerName = (shipment: Shipment) => {
    if (!shipment.profiles) return "Unknown";
    
    const firstName = shipment.profiles.first_name || "";
    const lastName = shipment.profiles.last_name || "";
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    
    return shipment.profiles.email;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Shipments Management</h1>
        <p className="text-muted-foreground">Monitor and manage all shipments in the system</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search shipments..."
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
          <Button size="sm">
            <Package className="mr-2 h-4 w-4" />
            New Shipment
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        {isLoading ? (
          <div className="p-8 text-center">Loading shipments...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Error: {error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.length > 0 ? (
                filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.tracking_number}</TableCell>
                    <TableCell>{getCustomerName(shipment)}</TableCell>
                    <TableCell>{shipment.origin}</TableCell>
                    <TableCell>{shipment.destination}</TableCell>
                    <TableCell>{new Date(shipment.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(shipment.status)}>
                        {shipment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No shipments found
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

export default ShipmentsManagement;
