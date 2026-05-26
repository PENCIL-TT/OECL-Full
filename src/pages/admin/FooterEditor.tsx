import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Save, RefreshCw, PanelBottom, Image as ImageIcon } from 'lucide-react';

const countries = [
  { value: "singapore", label: "Singapore" },
  { value: "india", label: "India" },
  { value: "malaysia", label: "Malaysia" },
  { value: "thailand", label: "Thailand" },
  { value: "indonesia", label: "Indonesia" },
];

const FooterEditor = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("singapore");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    about_text: "",
    facebook_url: "",
    linkedin_url: "",
    copyright_text: "",
    logo_url: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, [selectedCountry]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('footer_content')
        .select('*')
        .eq('country', selectedCountry)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          about_text: data.about_text || "",
          facebook_url: data.facebook_url || "",
          linkedin_url: data.linkedin_url || "",
          copyright_text: data.copyright_text || "",
          logo_url: data.logo_url || "",
        });
      } else {
        setFormData({
          about_text: "At OECL, we are proud to be one of Singapore's leading logistics companies...",
          facebook_url: "https://www.facebook.com/oeclsingapore/",
          linkedin_url: "https://sg.linkedin.com/company/oecl",
          copyright_text: "OECL. All Rights Reserved.",
          logo_url: "",
        });
      }
      setLogoFile(null);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error fetching data', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalLogoUrl = formData.logo_url;

      // Handle file upload if a new logo is selected
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `footer-logo-${selectedCountry}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('hero-images')
          .upload(fileName, logoFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('hero-images').getPublicUrl(fileName);
        finalLogoUrl = publicUrl;
      }

      const payload = { country: selectedCountry, ...formData, logo_url: finalLogoUrl, updated_at: new Date().toISOString() };
      const { error } = await supabase.from('footer_content').upsert(payload, { onConflict: 'country' });
      if (error) throw error;

      toast({ title: "Success", description: "Footer content updated successfully!" });
      fetchData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const previewUrl = logoFile ? URL.createObjectURL(logoFile) : formData.logo_url;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card><CardHeader><CardTitle>Select Country Context</CardTitle></CardHeader><CardContent><Select value={selectedCountry} onValueChange={setSelectedCountry}><SelectTrigger className="w-48"><SelectValue placeholder="Select country" /></SelectTrigger><SelectContent>{countries.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select></CardContent></Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center"><CardTitle className="flex items-center gap-2"><PanelBottom className="w-5 h-5 text-red-600" /> Edit Footer Content</CardTitle><Button onClick={handleSave} disabled={loading || saving} className="bg-red-600 hover:bg-red-700 text-white">{saving ? <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</span> : <span className="flex items-center"><Save className="w-4 h-4 mr-2" /> Save Changes</span>}</Button></CardHeader>
        <CardContent>{loading ? <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div> : (
          <form className="space-y-8">
            <div className="space-y-2"><Label>About OECL Text</Label><Textarea name="about_text" value={formData.about_text} onChange={handleChange} rows={4} placeholder="At OECL, we are proud to be..." /></div>
            <div className="space-y-2"><Label>Facebook URL</Label><Input name="facebook_url" value={formData.facebook_url} onChange={handleChange} placeholder="https://facebook.com/..." /></div>
            <div className="space-y-2"><Label>LinkedIn URL</Label><Input name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} placeholder="https://linkedin.com/..." /></div>
            <div className="space-y-2"><Label>Copyright Text</Label><Input name="copyright_text" value={formData.copyright_text} onChange={handleChange} placeholder="OECL. All Rights Reserved." /></div>
            
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-gray-500" />
                Footer Logo Image
              </Label>
              <p className="text-sm text-slate-500 mb-2">Upload a custom logo for this country to override the default OECL logo.</p>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)} 
              />
              {previewUrl && (
                <div className="mt-4 p-6 border rounded-xl bg-slate-50 flex items-center justify-center h-40 shadow-inner">
                  <img src={previewUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                </div>
              )}
            </div>
          </form>
        )}</CardContent>
      </Card>
    </div>
  );
};
export default FooterEditor;