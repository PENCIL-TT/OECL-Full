import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Image as ImageIcon, RefreshCw, Users, Trash2, Plus } from "lucide-react";

const countries = [
  { value: "singapore", label: "Singapore" },
  { value: "india", label: "India" },
  { value: "malaysia", label: "Malaysia" },
  { value: "thailand", label: "Thailand" },
  { value: "indonesia", label: "Indonesia" },
];

const defaultAboutContent = {
  title: "About OECL",
  mission: "Your premier global logistics and supply chain partner, delivering excellence across Southeast Asia and beyond",
  vision: "To be the most customer-focused logistics company, delivering innovative and reliable solutions that drive success for our clients worldwide.",
  content: "Established in 2008 by a team of well-experienced professionals, OECL is headquartered in Singapore and stands as one of the premier global logistics and supply chain partners in the region.\n\nWith over 30 years of combined experience, we deliver world-class logistics services with passion and commitment across various industries, helping businesses optimize their supply chain operations.\n\nOur outstanding performance in handling diverse products efficiently is backed by our dedicated team, streamlined processes, and cutting-edge technology that powers our expanding global office network.",
  image_url: "/customclearance.png",
  features: [
    "World-class logistics services",
    "Cutting-edge technology solutions",
    "Dedicated professional team",
    "Global office network",
    "24/7 customer support",
    "Competitive pricing"
  ],
  story_title: "Our Story",
  vision_title: "Our Vision",
  floating_stat_number: "1M+",
  floating_stat_label: "Successful Deliveries"
};

const AboutUsEditor = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("singapore");
  const { toast } = useToast();

  const [pageTitle, setPageTitle] = useState("About OECL");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [pageContent, setPageContent] = useState("");
  const [pageImageFile, setPageImageFile] = useState<File | null>(null);
  const [pageImagePreview, setPageImagePreview] = useState<string | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [storyTitle, setStoryTitle] = useState(defaultAboutContent.story_title);
  const [visionTitle, setVisionTitle] = useState(defaultAboutContent.vision_title);
  const [floatingStatNumber, setFloatingStatNumber] = useState(defaultAboutContent.floating_stat_number);
  const [floatingStatLabel, setFloatingStatLabel] = useState(defaultAboutContent.floating_stat_label);

  useEffect(() => {
    fetchData();
  }, [selectedCountry]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .eq("country", selectedCountry)
        .maybeSingle();
        
      if (error) throw error;

      if (data) {
        setPageTitle(data.title || defaultAboutContent.title);
        setMission(data.mission || defaultAboutContent.mission);
        setVision(data.vision || defaultAboutContent.vision);
        setPageContent(data.content || defaultAboutContent.content);
        setPageImagePreview(data.image_url || defaultAboutContent.image_url);
        setFeatures(data.features || defaultAboutContent.features);
        setStoryTitle(data.story_title || defaultAboutContent.story_title);
        setVisionTitle(data.vision_title || defaultAboutContent.vision_title);
        setFloatingStatNumber(data.floating_stat_number || defaultAboutContent.floating_stat_number);
        setFloatingStatLabel(data.floating_stat_label || defaultAboutContent.floating_stat_label);
      } else {
        setPageTitle(defaultAboutContent.title);
        setMission(defaultAboutContent.mission); 
        setVision(defaultAboutContent.vision); 
        setPageContent(defaultAboutContent.content); 
        setPageImagePreview(defaultAboutContent.image_url);
        setFeatures(defaultAboutContent.features);
        setStoryTitle(defaultAboutContent.story_title);
        setVisionTitle(defaultAboutContent.vision_title);
        setFloatingStatNumber(defaultAboutContent.floating_stat_number);
        setFloatingStatLabel(defaultAboutContent.floating_stat_label);
      }
      setPageImageFile(null);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error fetching data", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalImageUrl = pageImagePreview;
      if (pageImageFile) {
        const fileExt = pageImageFile.name.split('.').pop();
        const fileName = `about_page_${selectedCountry}_${Date.now()}.${fileExt}`;
        const filePath = `${selectedCountry}/${fileName}`;
        const { error } = await supabase.storage.from('hero-images').upload(filePath, pageImageFile, { upsert: true });
        if (error) throw error;
        const { data } = supabase.storage.from('hero-images').getPublicUrl(filePath);
        finalImageUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from("about_content")
        .upsert({ 
          country: selectedCountry,
          title: pageTitle, 
          mission, 
          vision, 
          content: pageContent, 
          image_url: finalImageUrl,
          features,
          story_title: storyTitle,
          vision_title: visionTitle,
          floating_stat_number: floatingStatNumber,
          floating_stat_label: floatingStatLabel,
          updated_at: new Date().toISOString() 
        }, { onConflict: 'country' });

      if (error) throw error;
      toast({ title: "Success", description: "About Us page content updated successfully!" });
      fetchData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error saving content", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handlePageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPageImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setPageImagePreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader><CardTitle>Select Country Context</CardTitle></CardHeader>
        <CardContent>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}><SelectTrigger className="w-48"><SelectValue placeholder="Select country" /></SelectTrigger><SelectContent>{countries.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-red-600" /> Edit About Us Page</CardTitle>
          <Button onClick={handleSave} disabled={loading || saving} className="bg-red-600 hover:bg-red-700 text-white">{saving ? <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</span> : <span className="flex items-center"><Save className="w-4 h-4 mr-2" /> Save Content</span>}</Button>
        </CardHeader>
        <CardContent>
          {loading ? <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div> : (
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div><Label htmlFor="pageTitle">Page Title</Label><Input id="pageTitle" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="e.g. About OECL Logistics" /></div>
                  <div><Label htmlFor="pageImage">Banner/Team Image</Label><Input id="pageImage" type="file" accept="image/*" onChange={handlePageFileChange} /></div>
                </div>
                <div>{pageImagePreview ? <img src={pageImagePreview} alt="Preview" className="w-full h-32 object-cover rounded-md border" /> : <div className="w-full h-32 bg-gray-100 rounded-md border flex flex-col items-center justify-center text-gray-400"><ImageIcon className="h-8 w-8 mb-2" /><span className="text-sm">No image</span></div>}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="mission">Our Mission</Label><Textarea id="mission" value={mission} onChange={(e) => setMission(e.target.value)} rows={4} placeholder="Enter company mission..." /></div>
                <div className="space-y-2">
                  <div><Label htmlFor="visionTitle">Vision Title</Label><Input id="visionTitle" value={visionTitle} onChange={(e) => setVisionTitle(e.target.value)} placeholder="Our Vision" /></div>
                  <div><Label htmlFor="vision">Our Vision</Label><Textarea id="vision" value={vision} onChange={(e) => setVision(e.target.value)} rows={2} placeholder="Enter company vision..." /></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="storyTitle">Story Title</Label><Input id="storyTitle" value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} placeholder="Our Story" /></div>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <Label htmlFor="floatingStatNumber">Image Stat Number</Label>
                    <Input id="floatingStatNumber" value={floatingStatNumber} onChange={(e) => setFloatingStatNumber(e.target.value)} placeholder="1M+" />
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="floatingStatLabel">Image Stat Label</Label>
                    <Input id="floatingStatLabel" value={floatingStatLabel} onChange={(e) => setFloatingStatLabel(e.target.value)} placeholder="Successful Deliveries" />
                  </div>
                </div>
              </div>
              <div>
                <Label>Key Features / Highlights</Label>
                <div className="space-y-2 mt-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        value={feature} 
                        onChange={(e) => {
                          const newFeatures = [...features];
                          newFeatures[index] = e.target.value;
                          setFeatures(newFeatures);
                        }} 
                        placeholder="e.g. 24/7 customer support"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => setFeatures([...features, ""])} className="mt-2 text-sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Feature
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="pageContent">Main Content (Markdown supported)</Label>
                <Textarea id="pageContent" value={pageContent} onChange={(e) => setPageContent(e.target.value)} rows={12} className="mt-2" placeholder="Enter the main content for the About Us page..." />
                <div className="text-xs text-gray-500 mt-2"><strong>Formatting help:</strong> **bold**, *italic*, link text, - bullet list</div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutUsEditor;