import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Image as ImageIcon, RefreshCw, Bold, Italic, Underline, Link as LinkIcon, List } from "lucide-react";

const countries = [
  { value: "singapore", label: "Singapore" },
  { value: "india", label: "India" },
  { value: "malaysia", label: "Malaysia" },
  { value: "thailand", label: "Thailand" },
  { value: "indonesia", label: "Indonesia" },
];

const HomepageAboutEditor = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("singapore");
  const { toast } = useToast();

  // --- Home Page Section State ---
  const [formData, setFormData] = useState({
    title: "",
    block1_title1: "",
    block1_title2: "",
    block1_desc: "",
    block2_title1: "",
    block2_title2: "",
    block2_desc: "",
    stats_number: "",
    stats_label: "",
    image_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // --- Dedicated About Page State ---

  useEffect(() => {
    fetchAboutData();
  }, [selectedCountry]);

  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_about')
        .select('*')
        .eq('country', selectedCountry)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || "",
          block1_title1: data.block1_title1 || "",
          block1_title2: data.block1_title2 || "",
          block1_desc: data.block1_desc || "",
          block2_title1: data.block2_title1 || "",
          block2_title2: data.block2_title2 || "",
          block2_desc: data.block2_desc || "",
          stats_number: data.stats_number || "",
          stats_label: data.stats_label || "",
          image_url: data.image_url || "/lovable-uploads/14af4f37-de1e-4e64-b5d7-b6a53ec592d7.png",
        });
      } else {
        // Fallback to default copy if none exists for the newly selected country
        setFormData({
          title: "About Us",
          block1_title1: "Established in 2008 and headquartered in Singapore",
          block1_title2: "",
          block1_desc: "OECL is a premier global logistics and supply chain partner founded by experienced professionals. With over 30 years of service across various industries, the company is known for its passionate and efficient delivery of world-class logistics solutions.",
          block2_title1: "Global Expansion Driven by Innovation and Excellence",
          block2_title2: "",
          block2_desc: "OECL’s growth is driven by a dedicated team, simplified processes, and advanced technology, enabling global office expansion. The company is well-positioned to meet international market demands and has firm plans to expand further across Southeast Asia.",
          stats_number: "1M+",
          stats_label: "Successful Deliveries",
          image_url: "/lovable-uploads/14af4f37-de1e-4e64-b5d7-b6a53ec592d7.png",
        });
      }
      setImageFile(null);
    } catch (error: any) {
      console.error("Error fetching homepage_about:", error);
      toast({ variant: "destructive", title: "Error fetching data", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveHome = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let updatedImageUrl = formData.image_url;

      // We reuse 'hero-images' storage bucket for convenience, but you can change it if you created a dedicated one.
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `home-about-${Date.now()}.${fileExt}`;
        const filePath = `${selectedCountry}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('hero-images')
          .upload(filePath, imageFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('hero-images')
          .getPublicUrl(filePath);

        updatedImageUrl = publicUrl;
      }

      const payload = {
        country: selectedCountry,
        ...formData,
        image_url: updatedImageUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('homepage_about')
        .upsert(payload, { onConflict: 'country' });

      if (error) throw error;

      toast({ title: "Success", description: "Home page About section updated successfully!" });
      fetchAboutData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const previewUrl = imageFile ? URL.createObjectURL(imageFile) : formData.image_url;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader><CardTitle>Select Country Context</CardTitle></CardHeader>
        <CardContent>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="home">Home Page Section</TabsTrigger>
        </TabsList>

        {/* HOME PAGE ABOUT SECTION TAB */}
        <TabsContent value="home">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Edit Home Page About Content</CardTitle>
              <Button onClick={handleSaveHome} disabled={loading || saving} className="bg-red-600 hover:bg-red-700 text-white">
                {saving ? <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</span> : <span className="flex items-center"><Save className="w-4 h-4 mr-2" /> Save Content</span>}
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div>
              ) : (
                <form className="space-y-8">
                  <div className="space-y-2">
                    <Label>Main Section Title</Label>
                    <Input name="title" value={formData.title} onChange={handleChange} placeholder="About Us" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-xl bg-slate-50">
                    <div className="space-y-2"><Label>Block 1 - Primary Title</Label><Input name="block1_title1" value={formData.block1_title1} onChange={handleChange} placeholder="Established in 2008..." /></div>
                    <div className="space-y-2"><Label>Block 1 - Secondary Title</Label><Input name="block1_title2" value={formData.block1_title2} onChange={handleChange} placeholder="Our Mission" /></div>
                    <div className="space-y-2 md:col-span-2"><Label>Block 1 - Description</Label><Textarea name="block1_desc" value={formData.block1_desc} onChange={handleChange} rows={4} /></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-xl bg-slate-50">
                    <div className="space-y-2"><Label>Block 2 - Primary Title</Label><Input name="block2_title1" value={formData.block2_title1} onChange={handleChange} placeholder="Global Expansion..." /></div>
                    <div className="space-y-2"><Label>Block 2 - Secondary Title</Label><Input name="block2_title2" value={formData.block2_title2} onChange={handleChange} placeholder="Our Vision" /></div>
                    <div className="space-y-2 md:col-span-2"><Label>Block 2 - Description</Label><Textarea name="block2_desc" value={formData.block2_desc} onChange={handleChange} rows={4} /></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-xl bg-slate-50">
                    <div className="space-y-2"><Label>Stats Value (e.g. 1M+)</Label><Input name="stats_number" value={formData.stats_number} onChange={handleChange} /></div>
                    <div className="space-y-2"><Label>Stats Label (e.g. Successful Deliveries)</Label><Input name="stats_label" value={formData.stats_label} onChange={handleChange} /></div>
                  </div>

                  <div className="space-y-4">
                    <Label>Side Image</Label>
                    <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    {previewUrl && (
                      <div className="mt-4 rounded-xl border-2 border-dashed border-slate-200 overflow-hidden w-64 h-64"><img src={previewUrl} alt="Preview" className="w-full h-full object-cover" /></div>
                    )}
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomepageAboutEditor;