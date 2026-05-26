
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Settings, 
  LogOut, 
  User,
  CreditCard
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "shipments", label: "Shipments", icon: Package },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-full md:w-64 bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-fit">
      <div className="flex flex-col items-center mb-6 pt-2">
        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
          <User className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="font-medium">John Doe</h3>
        <p className="text-sm text-gray-500">Customer ID: C-12345</p>
      </div>
      
      <div className="space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === item.id ? "bg-kargon-red hover:bg-kargon-red/90" : ""
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </div>
      
      <div className="pt-6 mt-6 border-t border-gray-100">
        <Button onClick={handleLogout} variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
