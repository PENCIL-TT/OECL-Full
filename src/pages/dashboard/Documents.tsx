
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  FileText, 
  Upload, 
  Download,
  FileCheck,
  FileWarning,
  Plus,
  Eye
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DocumentsPage = () => {
  // Mock data for documents
  const documents = [
    { id: "DOC-001", name: "Commercial Invoice", type: "invoice", date: "2023-10-15", shipment: "SH-2023-001", status: "verified" },
    { id: "DOC-002", name: "Bill of Lading", type: "bl", date: "2023-10-12", shipment: "SH-2023-001", status: "verified" },
    { id: "DOC-003", name: "Packing List", type: "packing", date: "2023-10-14", shipment: "SH-2023-001", status: "verified" },
    { id: "DOC-004", name: "Certificate of Origin", type: "certificate", date: "2023-10-18", shipment: "SH-2023-002", status: "pending" },
    { id: "DOC-005", name: "Insurance Certificate", type: "insurance", date: "2023-10-20", shipment: "SH-2023-003", status: "pending" },
    { id: "DOC-006", name: "Customs Declaration", type: "customs", date: "2023-10-16", shipment: "SH-2023-002", status: "verified" }
  ];

  const templates = [
    { id: "TPL-001", name: "Commercial Invoice Template", type: "invoice", category: "International" },
    { id: "TPL-002", name: "Bill of Lading Template", type: "bl", category: "Sea Freight" },
    { id: "TPL-003", name: "Air Waybill Template", type: "awb", category: "Air Freight" },
    { id: "TPL-004", name: "Customs Declaration Form", type: "customs", category: "Customs" },
    { id: "TPL-005", name: "Dangerous Goods Declaration", type: "dangerous", category: "Compliance" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-kargon-dark">Documents</h1>
        <Button className="bg-kargon-red hover:bg-kargon-red/90">
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>
      
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="documents">My Documents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>All Documents</CardTitle>
                  <CardDescription>Manage your shipping documents</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search documents..."
                    className="pl-8 w-full md:w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Shipment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.id}</TableCell>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell className="capitalize">{doc.type}</TableCell>
                        <TableCell>{doc.shipment}</TableCell>
                        <TableCell>{doc.date}</TableCell>
                        <TableCell>
                          {doc.status === "verified" ? (
                            <div className="flex items-center text-green-600">
                              <FileCheck className="mr-1 h-4 w-4" />
                              <span>Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-amber-600">
                              <FileWarning className="mr-1 h-4 w-4" />
                              <span>Pending</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Document Templates</CardTitle>
                  <CardDescription>Use these templates for your shipping documents</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" /> New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.id}</TableCell>
                        <TableCell>{template.name}</TableCell>
                        <TableCell className="capitalize">{template.type}</TableCell>
                        <TableCell>{template.category}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentsPage;
