import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, LayoutTemplate, FileText, Image as ImageIcon, 
  Save, Globe, Sparkles, Activity, AlertCircle, 
  CheckCircle2, Clock, MoreVertical, ExternalLink, RefreshCw
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// --- Mock Data ---
const MOCK_PAGES = [
  { id: 'home', title: 'Homepage', path: '/', status: 'optimized', score: 92, lastEdited: '2 hours ago' },
  { id: 'about', title: 'About Us', path: '/about-us', status: 'needs-work', score: 65, lastEdited: '1 day ago' },
  { id: 'services', title: 'Services', path: '/services', status: 'optimized', score: 88, lastEdited: '3 days ago' },
  { id: 'global', title: 'Global Presence', path: '/global-presence', status: 'critical', score: 45, lastEdited: '1 week ago' },
  { id: 'blog', title: 'Blog Overview', path: '/blog', status: 'optimized', score: 95, lastEdited: '5 mins ago' },
];

interface SeoData {
  id?: string;
  page_slug: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
}

const SeoEditor = () => {
  const [activePage, setActivePage] = useState(MOCK_PAGES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<Partial<SeoData>>({});
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState('Never');
  const { toast } = useToast();

  useEffect(() => {
    fetchSeoData(activePage.id);
  }, [activePage]);

  const fetchSeoData = async (slug: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_slug', slug)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({ ...data, keywords: (data.keywords || []).join(', ') });
      } else {
        setFormData({ page_slug: slug, meta_title: '', meta_description: '', keywords: '', og_title: '', og_description: '', og_image: '' });
      }
      setIsDirty(false);
      setOgImageFile(null);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error fetching SEO data", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Simulating form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let imageUrl = formData.og_image;

      if (ogImageFile) {
        const fileExt = ogImageFile.name.split('.').pop();
        const fileName = `${activePage.id}-og-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('seo-images')
          .upload(fileName, ogImageFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('seo-images').getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      const { error } = await supabase.from('page_seo').upsert({
        ...formData,
        page_slug: activePage.id,
        keywords: formData.keywords?.split(',').map(k => k.trim()).filter(Boolean) || [],
        og_image: imageUrl,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'page_slug' });

      if (error) throw error;

      toast({ title: "Success", description: "SEO settings saved." });
      setIsDirty(false);
      setOgImageFile(null);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      await fetchSeoData(activePage.id);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  // Character count limits
  const limits = { meta_title: 60, meta_description: 160, og_title: 60, og_description: 110 };

  // Derived SEO Score (Simple simulation)
  const calculateScore = () => {
    let score = 100;
    if ((formData.meta_title?.length || 0) > limits.meta_title) score -= 15;
    if ((formData.meta_title?.length || 0) < 30) score -= 10;
    if ((formData.meta_description?.length || 0) > limits.meta_description) score -= 20;
    if ((formData.meta_description?.length || 0) < 100) score -= 15;
    if (!formData.keywords) score -= 10;
    return Math.max(0, score);
  };
  const currentScore = calculateScore();
  const ogImagePreview = ogImageFile ? URL.createObjectURL(ogImageFile) : formData.og_image;

  return (
    <div className="min-h-screen bg-[#f5f7fb] font-sans pb-20">
      
      {/* --- Premium Header --- */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-6 lg:px-10 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-gradient-to-br from-[#ff004f] to-[#ff4d79] rounded-xl flex items-center justify-center shadow-lg shadow-[#ff004f]/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-0.5">
              <span>Admin</span>
              <span className="text-slate-300">/</span>
              <span>Settings</span>
              <span className="text-slate-300">/</span>
              <span className="text-[#ff004f]">SEO Editor</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800 leading-none tracking-tight">Search Engine Optimization</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-500 mr-4">
            {isDirty ? (
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Unsaved changes</span>
            ) : (
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Saved at {lastSaved}</span>
            )}
          </div>
          <Button variant="outline" className="hidden sm:flex border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-10 px-4 transition-all">
            Discard
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !isDirty}
            className="bg-gradient-to-r from-[#ff004f] to-[#e60047] hover:from-[#e60047] hover:to-[#cc003f] text-white rounded-xl h-10 px-6 shadow-md shadow-[#ff004f]/20 transition-all border-none"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Publish Changes
          </Button>
        </div>
      </header>

      {/* --- Main 2-Column Layout --- */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT PANEL: Explorer --- */}
        <aside className="lg:col-span-3 xl:col-span-3">
          <div className="sticky top-28 bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-5 overflow-hidden">
            
            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Find a page..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ff004f]/20 focus:border-[#ff004f] transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3 px-2">
              Website Pages
            </div>
            
            {/* Pages List */}
            <div className="space-y-1.5">
              {MOCK_PAGES.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map((page) => {
                const isActive = activePage.id === page.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => setActivePage(page)}
                    className={`w-full group flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#ff004f]/5 to-transparent border-l-4 border-[#ff004f] shadow-sm' 
                        : 'hover:bg-slate-50 border-l-4 border-transparent text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-[#ff004f]/10 text-[#ff004f]' : 'bg-white shadow-sm border border-slate-100 text-slate-400 group-hover:text-[#ff004f]'}`}>
                        <LayoutTemplate className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className={`text-sm font-semibold ${isActive ? 'text-slate-800' : 'text-slate-600'}`}>{page.title}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> {page.lastEdited}
                        </div>
                      </div>
                    </div>
                    {/* Status Dot */}
                    <div className={`w-2 h-2 rounded-full ${
                      page.status === 'optimized' ? 'bg-emerald-400' : 
                      page.status === 'needs-work' ? 'bg-amber-400' : 'bg-red-400'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* --- RIGHT PANEL: Editor Cards --- */}
        <main className={`lg:col-span-9 xl:col-span-9 space-y-6 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
          
          {/* Score Header Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                Editing: {activePage.title} <span className="text-slate-400 font-medium text-lg">({activePage.path})</span>
              </h2>
              <p className="text-slate-500 text-sm mt-1">Optimize the metadata below to improve search engine rankings.</p>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[240px]">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700">SEO Health</span>
                  <span className={`text-lg font-black ${currentScore > 80 ? 'text-emerald-500' : currentScore > 50 ? 'text-amber-500' : 'text-red-500'}`}>
                    {currentScore}/100
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${currentScore > 80 ? 'bg-emerald-500' : currentScore > 50 ? 'bg-amber-500' : 'bg-[#ff004f]'}`}
                    style={{ width: `${currentScore}%` }}
                  />
                </div>
              </div>
              <Activity className={`w-8 h-8 ${currentScore > 80 ? 'text-emerald-500' : currentScore > 50 ? 'text-amber-500' : 'text-[#ff004f]'}`} />
            </div>
          </motion.div>

          {/* Row: Basic SEO & Google Preview */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* 1. Basic Settings Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#ff004f]" />
                  <h3 className="font-bold text-slate-800">Basic Metadata</h3>
                </div>
              </div>
              <div className="p-6 space-y-6 flex-1">
                
                {/* Title Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-semibold text-slate-700">Meta Title</label>
                    <span className={`text-xs font-medium ${(formData.meta_title?.length || 0) > limits.meta_title ? 'text-[#ff004f]' : 'text-slate-400'}`}>
                      {formData.meta_title?.length || 0} / {limits.meta_title}
                    </span>
                  </div>
                  <Input 
                    name="meta_title" value={formData.meta_title || ''} onChange={handleChange}
                    className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-[#ff004f]/20 focus:border-[#ff004f] transition-all rounded-xl h-11"
                  />
                  {(formData.meta_title?.length || 0) > limits.meta_title && (
                    <p className="text-xs text-[#ff004f] flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> Title is too long. Truncation may occur.</p>
                  )}
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-semibold text-slate-700">Meta Description</label>
                    <span className={`text-xs font-medium ${(formData.meta_description?.length || 0) > limits.meta_description ? 'text-[#ff004f]' : 'text-slate-400'}`}>
                      {formData.meta_description?.length || 0} / {limits.meta_description}
                    </span>
                  </div>
                  <Textarea 
                    name="meta_description" value={formData.meta_description || ''} onChange={handleChange} rows={4}
                    className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-[#ff004f]/20 focus:border-[#ff004f] transition-all rounded-xl resize-none"
                  />
                  {(formData.meta_description?.length || 0) < 100 && (
                    <p className="text-xs text-amber-500 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> Description is too short. Aim for ~150 chars.</p>
                  )}
                </div>

              </div>
            </motion.div>

            {/* 2. Live Google Preview Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-slate-800">Search Result Preview</h3>
                </div>
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-wide">Live</span>
              </div>
              <div className="p-6 flex-1 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50/50">
                
                {/* Actual Google Mock */}
                <div className="bg-white w-full max-w-lg p-5 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center p-1 border border-slate-200">
                      <img src="/oecl.png" alt="Icon" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="text-[13px] text-[#202124] leading-tight">OECL Singapore</div>
                      <div className="text-[12px] text-[#4d5156] leading-tight flex items-center gap-1">
                        https://www.oecl.sg <MoreVertical className="w-3 h-3 text-slate-400" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer leading-tight mb-1 font-medium truncate">
                    {formData.meta_title || 'Page Title'}
                  </h4>
                  <p className="text-[14px] text-[#4d5156] leading-snug line-clamp-2">
                    {formData.meta_description || 'Page description will appear here...'}
                  </p>
                </div>

              </div>
            </motion.div>
          </div>

          {/* Row: OpenGraph & Social Preview */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* 3. OpenGraph Settings Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-500" />
                  <h3 className="font-bold text-slate-800">Social Media & OpenGraph</h3>
                </div>
              </div>
              <div className="p-6 space-y-6 flex-1">
                
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-semibold text-slate-700">OG Title</label>
                  </div>
                  <Input 
                    name="og_title" value={formData.og_title || ''} onChange={handleChange}
                    className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-[#ff004f]/20 focus:border-[#ff004f] transition-all rounded-xl h-11"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-semibold text-slate-700">OG Description</label>
                  </div>
                  <Textarea 
                    name="og_description" value={formData.og_description || ''} onChange={handleChange} rows={3}
                    className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-[#ff004f]/20 focus:border-[#ff004f] transition-all rounded-xl resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-semibold text-slate-700">OG Image</label>
                  </div>
                  <Input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => { setOgImageFile(e.target.files?.[0] || null); setIsDirty(true); }}
                    className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-[#ff004f]/20 focus:border-[#ff004f] transition-all rounded-xl h-11"
                  />
                </div>

              </div>
            </motion.div>

            {/* 4. Live Social Preview Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-500" />
                  <h3 className="font-bold text-slate-800">Social Share Preview</h3>
                </div>
                <span className="text-xs font-bold bg-purple-50 text-purple-600 px-3 py-1 rounded-full uppercase tracking-wide">Live</span>
              </div>
              <div className="p-6 flex-1 flex items-center justify-center bg-slate-50/50">
                
                {/* Actual Social Mock */}
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-video bg-slate-100 overflow-hidden">
                    {ogImagePreview ? (
                      <img src={ogImagePreview} alt="OG Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-slate-50">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">oecl.sg</div>
                    <h4 className="text-sm font-bold text-slate-800 truncate mt-1">
                      {formData.og_title || 'OpenGraph Title'}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {formData.og_description || 'OpenGraph description will appear here...'}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

          {/* Row: Keywords */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-800">Keywords & Technical</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Keywords</label>
                <Textarea 
                  name="keywords" value={formData.keywords || ''} onChange={handleChange} rows={3}
                  className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-[#ff004f]/20 focus:border-[#ff004f] transition-all rounded-xl resize-none"
                  placeholder="e.g., logistics, supply chain, freight forwarding"
                />
                <p className="text-xs text-slate-400">Separate keywords with commas. These help search engines understand your page content.</p>
              </div>
            </div>
          </motion.div>

        </main>
      </div>
    </div>
  );
};

export default SeoEditor;
