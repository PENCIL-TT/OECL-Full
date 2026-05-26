import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, RefreshCw, Image as ImageIcon, Info, Edit3, FileText, Target, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutEditor = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    hero_title: '',
    hero_description: '',
    hero_image_url: '',
    story_title: '',
    story_content: '',
    story_image_url: '',
    mission_statement: '',
    vision_statement: ''
  });
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [storyImageFile, setStoryImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchAboutPageContent();
  }, []);

  const fetchAboutPageContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_page_content')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFormData({
          hero_title: data.hero_title || '',
          hero_description: data.hero_description || '',
          hero_image_url: data.hero_image_url || '',
          story_title: data.story_title || '',
          story_content: data.story_content || '',
          story_image_url: data.story_image_url || '',
          mission_statement: data.mission_statement || '',
          vision_statement: data.vision_statement || ''
        });
      }
    } catch (error: any) {
      console.error('Error fetching about page content:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load about page content."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedData = { ...formData };

      // Handle Hero Image Upload
      if (heroImageFile) {
        const fileExt = heroImageFile.name.split('.').pop();
        const fileName = `about-hero-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('about-images')
          .upload(fileName, heroImageFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('about-images')
          .getPublicUrl(fileName);
        
        updatedData.hero_image_url = publicUrl;
      }

      // Handle Story Image Upload
      if (storyImageFile) {
        const fileExt = storyImageFile.name.split('.').pop();
        const fileName = `about-story-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('about-images')
          .upload(fileName, storyImageFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('about-images')
          .getPublicUrl(fileName);

        updatedData.story_image_url = publicUrl;
      }

      const { error } = await supabase
        .from('about_page_content')
        .upsert({
          id: 1,
          ...updatedData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "About Us Page content has been updated successfully.",
      });
      setHeroImageFile(null);
      setStoryImageFile(null);
      await fetchAboutPageContent();
    } catch (error: any) {
      console.error('Error saving about page content:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes."
      });
    } finally {
      setSaving(false);
    }
  };

  const heroPreviewUrl = heroImageFile ? URL.createObjectURL(heroImageFile) : formData.hero_image_url;
  const storyPreviewUrl = storyImageFile ? URL.createObjectURL(storyImageFile) : formData.story_image_url;

  if (loading) {
    return <div className="flex justify-center items-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-6 h-6 text-red-600" /> About Us Page Editor
          </h2>
          <p className="text-slate-500 text-sm mt-1">Manage the full content for the dedicated About Us page.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl h-10 px-6 shadow-md transition-all border-none"
        >
          {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-slate-800">Page Hero Section</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Hero Title</label>
                <Input name="hero_title" value={formData.hero_title} onChange={handleChange} placeholder="e.g., About OECL" className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-red-600/20 focus:border-red-600 transition-all rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Hero Description</label>
                <Textarea name="hero_description" value={formData.hero_description} onChange={handleChange} rows={3} className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-red-600/20 focus:border-red-600 transition-all rounded-xl resize-none" />
              </div>
            </div>
          </div>

          {/* Our Story */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-slate-800">Our Story / Main Body</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Story Title</label>
                <Input name="story_title" value={formData.story_title} onChange={handleChange} className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-red-600/20 focus:border-red-600 transition-all rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Story Content</label>
                <Textarea name="story_content" value={formData.story_content} onChange={handleChange} rows={8} className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-red-600/20 focus:border-red-600 transition-all rounded-xl resize-none" />
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-slate-800">Mission & Vision</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Mission Statement</label>
                <Textarea name="mission_statement" value={formData.mission_statement} onChange={handleChange} rows={3} className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-red-600/20 focus:border-red-600 transition-all rounded-xl resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Vision Statement</label>
                <Textarea name="vision_statement" value={formData.vision_statement} onChange={handleChange} rows={3} className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-red-600/20 focus:border-red-600 transition-all rounded-xl resize-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Hero Image */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-slate-800">Hero Image</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Upload Hero Image</label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)} 
                  className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-red-600/20 focus:border-red-600 transition-all rounded-xl" />
              </div>
              <div className="mt-4 rounded-xl border-2 border-dashed border-slate-200 p-2 overflow-hidden bg-slate-50 aspect-video flex items-center justify-center">
                {heroPreviewUrl ? <img src={heroPreviewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" /> : <div className="text-slate-400 flex flex-col items-center"><ImageIcon className="w-8 h-8 mb-2 opacity-50" /><span className="text-sm">No image</span></div>}
              </div>
            </div>
          </div>

          {/* Story Image */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Eye className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-slate-800">Story Image</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Upload Story Image</label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setStoryImageFile(e.target.files?.[0] || null)} 
                  className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-red-600/20 focus:border-red-600 transition-all rounded-xl" />
              </div>
              <div className="mt-4 rounded-xl border-2 border-dashed border-slate-200 p-2 overflow-hidden bg-slate-50 aspect-square flex items-center justify-center">
                {storyPreviewUrl ? <img src={storyPreviewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" /> : <div className="text-slate-400 flex flex-col items-center"><ImageIcon className="w-8 h-8 mb-2 opacity-50" /><span className="text-sm">No image</span></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutEditor;