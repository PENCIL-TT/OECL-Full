import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Award } from "lucide-react";

const countries = [
  { value: "singapore", label: "Singapore" },
  { value: "india", label: "India" },
  { value: "malaysia", label: "Malaysia" },
  { value: "thailand", label: "Thailand" },
  { value: "indonesia", label: "Indonesia" },
];

const CertificationEditor = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("singapore");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description_1: "",
    description_2: "",
    bullet_1: "",
    bullet_2: "",
    bullet_3: "",
    main_image: "",
    logo_1: "",
    logo_2: "",
    logo_3: "",
  });

  const [gridFormData, setGridFormData] = useState({
    grid_title: "",
    grid_image_1: "",
    grid_image_2: "",
    grid_image_3: "",
    grid_image_4: "",
    grid_image_5: "",
    grid_image_6: "",
    grid_image_7: "",
    grid_image_8: "",
  });

  const [gridFiles, setGridFiles] = useState({
    grid_image_1: null as File | null,
    grid_image_2: null as File | null,
    grid_image_3: null as File | null,
    grid_image_4: null as File | null,
    grid_image_5: null as File | null,
    grid_image_6: null as File | null,
    grid_image_7: null as File | null,
    grid_image_8: null as File | null,
  });

  const [files, setFiles] = useState({
    main_image: null as File | null,
    logo_1: null as File | null,
    logo_2: null as File | null,
    logo_3: null as File | null,
  });

  useEffect(() => {
    fetchData();
  }, [selectedCountry]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('certification_content')
        .select('*')
        .eq('country', selectedCountry)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || "",
          description_1: data.description_1 || "",
          description_2: data.description_2 || "",
          bullet_1: data.bullet_1 || "",
          bullet_2: data.bullet_2 || "",
          bullet_3: data.bullet_3 || "",
          main_image: data.main_image || "/certification.png",
          logo_1: data.logo_1 || "/logo1.jpeg",
          logo_2: data.logo_2 || "/logo2.jpeg",
          logo_3: data.logo_3 || "/logo3.jpeg",
        });
        setGridFormData({
          grid_title: data.grid_title || "Certifications",
          grid_image_1: data.grid_image_1 || "/certificate4.jpg",
          grid_image_2: data.grid_image_2 || "/certficate1.jpg",
          grid_image_3: data.grid_image_3 || "/certificate3.jpg",
          grid_image_4: data.grid_image_4 || "/certificate2.jpg",
          grid_image_5: data.grid_image_5 || "/AEO.jpg",
          grid_image_6: data.grid_image_6 || "/certificate6.jpeg",
          grid_image_7: data.grid_image_7 || "/MTO.jpg",
          grid_image_8: data.grid_image_8 || "",
        });
      } else {
        setFormData({
          title: "SICCI Centennial Celebration & Entrepreneur Awards",
          description_1: "A century of excellence and a legacy of leadership — celebrating with the Singapore Indian Chamber of Commerce & Industry (SICCI). We are proud to share this moment as our <strong>Group Chairman, Mr. Jayaprakash</strong>, receives the award, honoring his remarkable leadership and contribution.",
          description_2: "The award was presented by His Excellency <strong>Mr. Tharman Shanmugaratnam</strong>, President of the Republic of Singapore.",
          bullet_1: "Recognition at the SICCI Centennial Celebration & Entrepreneur Awards",
          bullet_2: "Active engagement with the Singapore business community",
          bullet_3: "Affiliations with SICCI, SBF, and the Singapore Logistics Association",
          main_image: "/certification.png",
          logo_1: "/logo1.jpeg",
          logo_2: "/logo2.jpeg",
          logo_3: "/logo3.jpeg",
        });
        setGridFormData({
          grid_title: "Certifications",
          grid_image_1: "/certificate4.jpg",
          grid_image_2: "/certficate1.jpg",
          grid_image_3: "/certificate3.jpg",
          grid_image_4: "/certificate2.jpg",
          grid_image_5: "/AEO.jpg",
          grid_image_6: "/certificate6.jpeg",
          grid_image_7: "/MTO.jpg",
          grid_image_8: "",
        });
      }
      setFiles({ main_image: null, logo_1: null, logo_2: null, logo_3: null });
      setGridFiles({
        grid_image_1: null,
        grid_image_2: null,
        grid_image_3: null,
        grid_image_4: null,
        grid_image_5: null,
        grid_image_6: null,
        grid_image_7: null,
        grid_image_8: null,
      });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error fetching data", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGridChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGridFormData({ ...gridFormData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (key: keyof typeof files) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [key]: e.target.files[0] });
    }
  };

  const handleGridFileChange = (key: keyof typeof gridFiles) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGridFiles({ ...gridFiles, [key]: e.target.files[0] });
    }
  };

  const uploadFile = async (file: File, prefix: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${prefix}-${selectedCountry}-${Date.now()}.${fileExt}`;
    const filePath = `${selectedCountry}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('hero-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('hero-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedData = { ...formData };

      if (files.main_image) updatedData.main_image = await uploadFile(files.main_image, 'cert-main');
      if (files.logo_1) updatedData.logo_1 = await uploadFile(files.logo_1, 'cert-logo1');
      if (files.logo_2) updatedData.logo_2 = await uploadFile(files.logo_2, 'cert-logo2');
      if (files.logo_3) updatedData.logo_3 = await uploadFile(files.logo_3, 'cert-logo3');

      const payload = {
        country: selectedCountry,
        ...updatedData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('certification_content')
        .upsert(payload, { onConflict: 'country' });

      if (error) throw error;

      toast({ title: "Success", description: "Certification section updated successfully!" });
      fetchData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleGridSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedData: any = { ...gridFormData };

      for (let i = 1; i <= 8; i++) {
        const key = `grid_image_${i}` as keyof typeof gridFiles;
        if (gridFiles[key]) {
          updatedData[key] = await uploadFile(gridFiles[key]!, `grid-cert-${i}`);
        }
      }

      const payload = {
        country: selectedCountry,
        ...updatedData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('certification_content')
        .upsert(payload, { onConflict: 'country' });

      if (error) throw error;
      toast({ title: "Success", description: "Grid Certification updated successfully!" });
      fetchData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const getPreviewUrl = (key: keyof typeof files) => files[key] ? URL.createObjectURL(files[key]!) : formData[key];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader><CardTitle>Select Country Context</CardTitle></CardHeader>
        <CardContent>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Select country" /></SelectTrigger>
            <SelectContent>
              {countries.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="standard">Standard Layout (Single Image)</TabsTrigger>
          <TabsTrigger value="grid">Grid Layout (Multi-Image)</TabsTrigger>
        </TabsList>

        {/* Standard Layout Tab */}
        <TabsContent value="standard">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-red-600" /> Edit Certification Content</CardTitle>
              <Button onClick={handleSave} disabled={loading || saving} className="bg-red-600 hover:bg-red-700 text-white">
                {saving ? <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</span> : <span className="flex items-center"><Save className="w-4 h-4 mr-2" /> Save Changes</span>}
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div>
              ) : (
                <form className="space-y-8">
                  <div className="space-y-2"><Label>Main Title</Label><Input name="title" value={formData.title} onChange={handleChange} placeholder="SICCI Centennial Celebration..." /></div>
                  
                  <div className="grid grid-cols-1 gap-6 p-4 border rounded-xl bg-slate-50">
                    <div className="space-y-2"><Label>Description Paragraph 1 (Supports HTML)</Label><Textarea name="description_1" value={formData.description_1} onChange={handleChange} rows={4} /></div>
                    <div className="space-y-2"><Label>Description Paragraph 2 (Supports HTML)</Label><Textarea name="description_2" value={formData.description_2} onChange={handleChange} rows={3} /></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-xl bg-slate-50">
                    <div className="space-y-2"><Label>Bullet Point 1</Label><Input name="bullet_1" value={formData.bullet_1} onChange={handleChange} /></div>
                    <div className="space-y-2"><Label>Bullet Point 2</Label><Input name="bullet_2" value={formData.bullet_2} onChange={handleChange} /></div>
                    <div className="space-y-2"><Label>Bullet Point 3</Label><Input name="bullet_3" value={formData.bullet_3} onChange={handleChange} /></div>
                  </div>

                  <div className="space-y-4">
                    <Label className="font-bold border-b pb-2 block">Images & Logos</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="space-y-2"><Label>Main Image</Label><Input type="file" accept="image/*" onChange={handleFileChange('main_image')} />{getPreviewUrl('main_image') && <div className="mt-2 border rounded p-1 bg-white h-32 flex justify-center items-center"><img src={getPreviewUrl('main_image')} alt="Main" className="max-h-full max-w-full object-contain" /></div>}</div>
                      <div className="space-y-2"><Label>Logo 1</Label><Input type="file" accept="image/*" onChange={handleFileChange('logo_1')} />{getPreviewUrl('logo_1') && <div className="mt-2 border rounded p-1 bg-white h-32 flex justify-center items-center"><img src={getPreviewUrl('logo_1')} alt="Logo 1" className="max-h-full max-w-full object-contain" /></div>}</div>
                      <div className="space-y-2"><Label>Logo 2</Label><Input type="file" accept="image/*" onChange={handleFileChange('logo_2')} />{getPreviewUrl('logo_2') && <div className="mt-2 border rounded p-1 bg-white h-32 flex justify-center items-center"><img src={getPreviewUrl('logo_2')} alt="Logo 2" className="max-h-full max-w-full object-contain" /></div>}</div>
                      <div className="space-y-2"><Label>Logo 3</Label><Input type="file" accept="image/*" onChange={handleFileChange('logo_3')} />{getPreviewUrl('logo_3') && <div className="mt-2 border rounded p-1 bg-white h-32 flex justify-center items-center"><img src={getPreviewUrl('logo_3')} alt="Logo 3" className="max-h-full max-w-full object-contain" /></div>}</div>
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grid Layout Tab */}
        <TabsContent value="grid">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-red-600" /> Edit Grid Certification Content</CardTitle>
              <Button onClick={handleGridSave} disabled={loading || saving} className="bg-red-600 hover:bg-red-700 text-white">
                {saving ? <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</span> : <span className="flex items-center"><Save className="w-4 h-4 mr-2" /> Save Changes</span>}
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div>
              ) : (
                <form className="space-y-8">
                  <div className="space-y-2">
                    <Label>Grid Title</Label>
                    <Input name="grid_title" value={gridFormData.grid_title} onChange={handleGridChange} placeholder="e.g. Certifications" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 border rounded-xl bg-slate-50">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                      const key = `grid_image_${i}` as keyof typeof gridFiles;
                      const preview = gridFiles[key] ? URL.createObjectURL(gridFiles[key]!) : gridFormData[key as keyof typeof gridFormData];
                      return (
                        <div key={i} className="space-y-2">
                          <Label>Image {i}</Label>
                          <Input type="file" accept="image/*" onChange={handleGridFileChange(key)} />
                          {preview && (
                            <div className="mt-2 border rounded p-1 bg-white h-32 flex justify-center items-center">
                              <img src={preview} alt={`Image ${i}`} className="max-h-full max-w-full object-contain" />
                            </div>
                          )}
                        </div>
                      );
                    })}
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
export default CertificationEditor;