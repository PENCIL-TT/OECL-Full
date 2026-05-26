
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Settings, 
  LogOut, 
  Shield,
  CreditCard,
  Image as ImageIcon,
  Info,
  FileText,
  Mail,
  Search,
  FolderOpen,
  Globe,
  MapPin,
  MonitorPlay,
  Link as LinkIcon,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "shipments", label: "Shipments", icon: Package },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "hero", label: "Home Page Editor", icon: MonitorPlay },
    { id: "portal-links", label: "Portal Links Editor", icon: LinkIcon },
    { id: "blog", label: "Blog Editor", icon: FileText },
    { id: "gallery", label: "Gallery Editor", icon: ImageIcon },
    { id: "contact", label: "Contact Editor", icon: Mail },
    { id: "office-locations", label: "Office Locations", icon: MapPin },
    { id: "services", label: "Services Editor", icon: Package },
    { id: "projects", label: "Projects Editor", icon: FolderOpen },
    { id: "countries", label: "Countries Editor", icon: Globe },
    { id: "about", label: "About Us Editor", icon: Info },
    { id: "seo", label: "SEO Editor", icon: Search },
    { id: "settings", label: "System Settings", icon: Settings },
  ];

  return (
    <div className="w-full md:w-64 bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-fit">
      <div className="flex flex-col items-center mb-6 pt-2">
        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="font-medium">Admin Portal</h3>
        <p className="text-sm text-gray-500">System Administrator</p>
      </div>
      
      <div className="space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === item.id ? "bg-blue-600 hover:bg-blue-700" : ""
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

export default AdminSidebar;
