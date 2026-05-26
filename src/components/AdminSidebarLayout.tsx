import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Search, 
  Settings, 
  LogOut,
  Activity,
  FolderOpen,
  Bell,
  Search as SearchIcon,
  Globe,
  ChevronDown,
  Info,
  Package,
  MapPin,
  MonitorPlay,
  MessageSquare,
  Mail,
  Award,
  ClipboardCheck,
  Map as MapIcon,
  Star,
  Send,
  PanelBottom, Users,
  Plane, Ship, Box, UserCheck, Container, Truck, Cuboid,
  Link as LinkIcon,
  ExternalLink
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";


interface AdminSidebarLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'hero', label: 'Home Page Editor', icon: MonitorPlay },
  { id: 'portal-links', label: 'Portal Links Editor', icon: LinkIcon },
  { id: 'about-us', label: 'About Us Page Editor', icon: Users },
  { id: 'homepage-about', label: 'Home About Editor', icon: Info },
  { id: 'certification', label: 'Certification Editor', icon: Award },
  { id: 'blog', label: 'Blog Editor', icon: FileText },
  { id: 'gallery', label: 'Gallery Editor', icon: ImageIcon },
  { id: 'services', label: 'Services Editor', icon: Package },
  { id: 'contact', label: 'Contact Editor', icon: Mail },
  { id: 'contact-form', label: 'Contact Form Editor', icon: Send },
  { id: 'office-locations', label: 'Office Locations', icon: MapPin },
  { id: 'projects', label: 'Projects Editor', icon: FolderOpen },
  { id: 'footer', label: 'Footer Editor', icon: PanelBottom },
  { id: 'workflow', label: 'Workflow Editor', icon: ClipboardCheck },
  { id: 'stats', label: 'Stats Editor', icon: Activity },
  { id: 'global-presence', label: 'Global Presence Editor', icon: MapIcon },
  { id: 'updates', label: 'Updates Editor', icon: Star },
  { id: 'countries', label: 'Countries Selector', icon: Globe },
  { id: 'seo', label: 'SEO Editor', icon: Search }
];

const servicePageItems = [
  { id: 'service-air-freight', label: 'Air Freight', icon: Plane },
  { id: 'service-ocean-freight', label: 'Ocean Freight', icon: Ship },
  { id: 'service-warehousing', label: 'Warehousing', icon: Box },
  { id: 'service-customs-clearance', label: 'Customs Clearance', icon: UserCheck },
  { id: 'service-liner-agency', label: 'Liner Agency', icon: Container },
  { id: 'service-liquid-cargo', label: 'Liquid Cargo', icon: Truck },
  { id: 'service-consolidation', label: 'Consolidation', icon: Cuboid },
  { id: 'service-project-cargo', label: 'Project Cargo', icon: Container },
  { id: 'service-3pl', label: '3PL', icon: Cuboid },
];

const AdminSidebarLayout: React.FC<AdminSidebarLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [adminCountry, setAdminCountry] = React.useState(localStorage.getItem('adminCountry') || 'singapore');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCountryChange = (value: string) => {
    setAdminCountry(value);
    localStorage.setItem('adminCountry', value);
    window.location.reload(); // Refresh to apply country context globally across all editors
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const countries = [
    { id: 'singapore', label: 'Singapore', flag: '🇸🇬' },
    { id: 'malaysia', label: 'Malaysia', flag: '🇲🇾' },
    { id: 'indonesia', label: 'Indonesia', flag: '🇮🇩' },
    { id: 'thailand', label: 'Thailand', flag: '🇹🇭' },
    { id: 'india', label: 'India', flag: '🇮🇳' },
    { id: 'myanmar', label: 'Myanmar', flag: '🇲🇲' },
    { id: 'china', label: 'China', flag: '🇨🇳' },
    { id: 'australia', label: 'Australia', flag: '🇦🇺' },
    { id: 'sri-lanka', label: 'Sri Lanka', flag: '🇱🇰' },
    { id: 'pakistan', label: 'Pakistan', flag: '🇵🇰' },
    { id: 'qatar', label: 'Qatar', flag: '🇶🇦' },
    { id: 'saudi-arabia', label: 'Saudi Arabia', flag: '🇸🇦' },
    { id: 'uae', label: 'UAE', flag: '🇦🇪' },
    { id: 'usa', label: 'USA', flag: '🇺🇸' },
    { id: 'uk', label: 'UK', flag: '🇬🇧' },
  ];

  return (
    <SidebarProvider>
      <Sidebar 
        variant="inset" 
        className="border-none [&>div[data-sidebar=sidebar]]:bg-gradient-to-br [&>div[data-sidebar=sidebar]]:from-red-700 [&>div[data-sidebar=sidebar]]:to-red-600 [&>div[data-sidebar=sidebar]]:shadow-2xl"
      >
        <SidebarHeader className="h-20 flex items-center justify-center border-b border-white/10 px-6">
          <div className="flex items-center gap-3 font-bold text-2xl text-white w-full">
            <div className="h-10 px-3 bg-white text-red-700 rounded-xl flex items-center justify-center shadow-lg text-lg font-black">
              OECL
            </div>
            <span className="tracking-tight drop-shadow-sm">Admin Portal</span>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup className="px-4 py-6">
            <SidebarGroupLabel className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 px-2">
              Main Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeTab === item.id}
                      onClick={() => setActiveTab(item.id)}
                      tooltip={item.label}
                      className={`transition-all duration-300 rounded-xl mb-2 px-4 py-3 flex items-center gap-3 h-auto ${
                        activeTab === item.id 
                          ? "bg-white text-red-700 shadow-lg font-bold translate-x-1" 
                          : "text-white/80 hover:bg-white/20 hover:text-white hover:translate-x-1"
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${activeTab === item.id ? "text-red-700" : "text-white/80"}`} />
                      <span className="text-sm">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="px-4 py-0 mb-6">
            <SidebarGroupLabel className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 px-2">
              Detailed Service Pages
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {servicePageItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeTab === item.id}
                      onClick={() => setActiveTab(item.id)}
                      tooltip={item.label}
                      className={`transition-all duration-300 rounded-xl mb-2 px-4 py-3 flex items-center gap-3 h-auto ${activeTab === item.id ? "bg-white text-red-700 shadow-lg font-bold translate-x-1" : "text-white/80 hover:bg-white/20 hover:text-white hover:translate-x-1"}`}
                    >
                      <item.icon className={`h-5 w-5 ${activeTab === item.id ? "text-red-700" : "text-white/80"}`} />
                      <span className="text-sm">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-white/10 p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
                className={`transition-all duration-300 rounded-xl mb-1 px-4 py-3 flex items-center gap-3 h-auto ${
                  activeTab === 'settings' 
                    ? "bg-white text-red-700 shadow-lg font-bold translate-x-1" 
                    : "text-white/80 hover:bg-white/20 hover:text-white hover:translate-x-1"
                }`}
              >
                <Settings className={`h-5 w-5 ${activeTab === 'settings' ? "text-red-700" : "text-white/80"}`} />
                <span className="text-sm">Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} className="text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300 rounded-xl px-4 py-3 flex items-center gap-3 h-auto mt-1 hover:translate-x-1">
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-slate-50/50">
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-xl px-4 md:px-8 shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <SidebarTrigger className="-ml-2 text-slate-500 hover:text-red-600 transition-colors" />
            <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2.5 w-72 border border-slate-200 focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-600 transition-all shadow-inner">
              <SearchIcon className="h-4 w-4 text-slate-400 mr-2" />
              <input type="text" placeholder="Search anything..." className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400 font-medium" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-5">
            <Select value={adminCountry} onValueChange={handleCountryChange}>
              <SelectTrigger className="w-[150px] h-9 bg-slate-100 border-slate-200 hidden md:flex font-medium text-slate-700">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="flex items-center gap-2">{c.flag} {c.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <a href="/" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors border border-slate-200 hover:border-red-100 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-red-50">
              <ExternalLink className="w-4 h-4" /> Live Site
            </a>
            <button className="relative p-2.5 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-px h-8 bg-slate-200 hidden md:block"></div>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 pr-4 rounded-full transition-colors border border-transparent hover:border-slate-200">
              <img src="https://i.pravatar.cc/150?img=11" alt="Admin" className="w-9 h-9 rounded-full border-2 border-white shadow-md" />
              <div className="hidden md:block text-sm">
                <p className="font-bold text-slate-800 leading-none mb-1">{user?.email || 'Admin User'}</p>
                <p className="text-xs font-medium text-slate-500">Super Admin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block ml-1" />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50/50">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminSidebarLayout;