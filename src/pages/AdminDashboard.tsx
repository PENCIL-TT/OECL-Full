import { useState, useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, 
  Image as ImageIcon, 
  FolderOpen,
  Users,
  Activity,
  Clock
} from 'lucide-react';
import BlogEditor from "./BlogEditor";
import SeoEditor from "./admin/SEOEditor";
import GalleryEditor from "@/components/GalleryEditor";
import UsersPage from "./admin/Users";
import ServicesEditor from "./admin/ServicesEditor";
import ServicePagesEditor from "./admin/ServicePagesEditor";
import ProjectsEditor from "./admin/ProjectsEditor";
import CountryEditor from "./admin/CountryEditor";
import HeroEditor from "./admin/HeroEditor";
import ContactPageEditor from "./admin/ContactPageEditor";
import ContactFormEditor from "./admin/ContactFormEditor";
import AboutUsEditor from "../AboutUsEditor";
import HomepageAboutEditor from "./admin/HomepageAboutEditor";
import CertificationEditor from "./admin/CertificationEditor";
import WorkflowEditor from "./admin/WorkflowEditor";
import StatsEditor from "./admin/StatsEditor";
import GlobalPresenceEditor from "./admin/GlobalPresenceEditor";
import UpdatesEditor from "./admin/UpdatesEditor";
import FooterEditor from "./admin/FooterEditor";
import LoadingSpinner from "@/components/LoadingSpinner";
import PortalLinksEditor from "./admin/PortalLinksEditor";
import OfficeLocationsEditor from "./admin/OfficeLocationsEditor";

const DashboardOverview = ({ setTab }: { setTab: (tab: string) => void }) => {
  const [stats, setStats] = useState({
    articles: 0,
    projects: 0,
    gallery: 0,
    users: 0,
  });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [articlesRes, projectsRes, galleryRes, usersRes] = await Promise.all([
          supabase.from('articles').select('id', { count: 'exact', head: true }),
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('gallery').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true })
        ]);

        const { data: recent } = await supabase
          .from('articles')
          .select('title, created_at')
          .order('created_at', { ascending: false })
          .limit(4);

        setStats({
          articles: articlesRes.count || 0,
          projects: projectsRes.count || 0,
          gallery: galleryRes.count || 0,
          users: usersRes.count || 0,
        });
        
        if (recent) setRecentArticles(recent);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const StatCard = ({ title, value, icon: Icon }: any) => (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 border border-slate-100 hover:shadow-lg transition-all duration-300 group cursor-pointer">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
          <h4 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h4>
        </div>
        <div className="p-3 bg-red-50 rounded-xl group-hover:bg-gradient-to-br group-hover:from-red-600 group-hover:to-red-700 transition-all duration-300 shadow-sm">
          <Icon className="w-6 h-6 text-red-600 group-hover:text-white transition-colors duration-300" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Dashboard Overview</h2>
        <p className="text-slate-500">Welcome to your admin control panel.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Articles" value={stats.articles} icon={FileText} />
        <StatCard title="Total Projects" value={stats.projects} icon={FolderOpen} />
        <StatCard title="Gallery Images" value={stats.gallery} icon={ImageIcon} />
        <StatCard title="Registered Users" value={stats.users} icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" /> System Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Database Connection</span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Storage Services</span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Authentication</span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Operational</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setTab('blog')} className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-xl hover:border-red-200 hover:bg-red-50 transition-all group">
              <FileText className="h-6 w-6 text-slate-400 group-hover:text-red-600 mb-2 transition-colors" />
              <span className="text-sm font-medium text-slate-600 group-hover:text-red-700">Write Article</span>
            </button>
            <button onClick={() => setTab('projects')} className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-xl hover:border-red-200 hover:bg-red-50 transition-all group">
              <FolderOpen className="h-6 w-6 text-slate-400 group-hover:text-red-600 mb-2 transition-colors" />
              <span className="text-sm font-medium text-slate-600 group-hover:text-red-700">Add Project</span>
            </button>
            <button onClick={() => setTab('gallery')} className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-xl hover:border-red-200 hover:bg-red-50 transition-all group">
              <ImageIcon className="h-6 w-6 text-slate-400 group-hover:text-red-600 mb-2 transition-colors" />
              <span className="text-sm font-medium text-slate-600 group-hover:text-red-700">Upload Image</span>
            </button>
            <button onClick={() => setTab('users')} className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-xl hover:border-red-200 hover:bg-red-50 transition-all group">
              <Users className="h-6 w-6 text-slate-400 group-hover:text-red-600 mb-2 transition-colors" />
              <span className="text-sm font-medium text-slate-600 group-hover:text-red-700">Manage Users</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-600" /> Recent Articles
          </h3>
          <div className="space-y-4">
            {recentArticles.length > 0 ? recentArticles.map((article, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium text-slate-700 truncate max-w-[200px] md:max-w-[250px]">{article.title}</span>
                </div>
                <span className="text-xs text-slate-500">{new Date(article.created_at).toLocaleDateString()}</span>
              </div>
            )) : (
              <p className="text-sm text-slate-500 p-3 bg-slate-50 rounded-lg">No articles found.</p>
            )}
          </div>
          <button onClick={() => setTab('blog')} className="mt-4 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">
            View all articles →
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAdmin, isLoading } = useAuth();

  const tab = searchParams.get('tab') || 'dashboard';

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const renderContent = () => {
    switch (tab) {
      case 'dashboard': return <DashboardOverview setTab={(newTab) => setSearchParams({ tab: newTab })} />;
      case 'hero': return <HeroEditor />;
      case 'portal-links': return <PortalLinksEditor />;
      case 'about-us': return <AboutUsEditor />;
      case 'homepage-about': return <HomepageAboutEditor />;
      case 'certification': return <CertificationEditor />;
      case 'blog': return <BlogEditor />;
      case 'seo': return <SeoEditor />;
      case 'gallery': return <GalleryEditor />;
      case 'contact': return <ContactPageEditor />;
      case 'contact-form': return <ContactFormEditor />;
      case 'office-locations': return <OfficeLocationsEditor />;
      case 'footer': return <FooterEditor />;
      case 'services': return <ServicesEditor />;
      case 'workflow': return <WorkflowEditor />;
      case 'service-air-freight': return <ServicePagesEditor activeSlug="air-freight" />;
      case 'service-ocean-freight': return <ServicePagesEditor activeSlug="ocean-freight" />;
      case 'service-warehousing': return <ServicePagesEditor activeSlug="warehousing" />;
      case 'service-customs-clearance': return <ServicePagesEditor activeSlug="customs-clearance" />;
      case 'service-liner-agency': return <ServicePagesEditor activeSlug="liner-agency" />;
      case 'service-liquid-cargo': return <ServicePagesEditor activeSlug="liquid-cargo" />;
      case 'service-consolidation': return <ServicePagesEditor activeSlug="consolidation" />;
      case 'service-project-cargo': return <ServicePagesEditor activeSlug="project-cargo" />;
      case 'service-3pl': return <ServicePagesEditor activeSlug="3pl" />;
      case 'stats': return <StatsEditor />;
      case 'global-presence': return <GlobalPresenceEditor />;
      case 'updates': return <UpdatesEditor />;
      case 'projects': return <ProjectsEditor />;
      case 'countries': return <CountryEditor />;
      case 'users': return <UsersPage />;
      default: return <div className="p-4">Dashboard Overview is temporarily disabled.</div>;
    }
  };

  return (
    <AdminSidebarLayout activeTab={tab} setActiveTab={(newTab) => setSearchParams({ tab: newTab })}>
      {renderContent()}
    </AdminSidebarLayout>
  );
};

export default AdminDashboard;
