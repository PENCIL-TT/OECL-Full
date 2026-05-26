import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Save, RefreshCw, Map as MapIcon } from 'lucide-react';

const countries = [
  { value: "singapore", label: "Singapore" },
  { value: "india", label: "India" },
  { value: "malaysia", label: "Malaysia" },
  { value: "thailand", label: "Thailand" },
  { value: "indonesia", label: "Indonesia" },
  { value: "myanmar", label: "Myanmar" },
  { value: "china", label: "China" },
  { value: "australia", label: "Australia" },
  { value: "sri-lanka", label: "Sri Lanka" },
  { value: "pakistan", label: "Pakistan" },
  { value: "qatar", label: "Qatar" },
  { value: "saudi-arabia", label: "Saudi Arabia" },
  { value: "uae", label: "UAE" },
  { value: "usa", label: "USA" },
  { value: "uk", label: "UK" },
];

const GlobalPresenceEditor = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("singapore");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    button_text: "",
  });

  useEffect(() => {
    fetchData();
  }, [selectedCountry]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_global_presence')
        .select('*')
        .eq('country', selectedCountry)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({ title: data.title || "", description: data.description || "", button_text: data.button_text || "" });
      } else {
        setFormData({ title: "Global Presence", description: "Our logistics network spans across continents, enabling seamless global shipping solutions.", button_text: "Explore Our Global Network" });
      }
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
      const payload = { country: selectedCountry, ...formData, updated_at: new Date().toISOString() };
      const { error } = await supabase.from('homepage_global_presence').upsert(payload, { onConflict: 'country' });
      if (error) throw error;

      toast({ title: "Success", description: "Global Presence section updated successfully!" });
      fetchData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card><CardHeader><CardTitle>Select Country Context</CardTitle></CardHeader><CardContent><Select value={selectedCountry} onValueChange={setSelectedCountry}><SelectTrigger className="w-48"><SelectValue placeholder="Select country" /></SelectTrigger><SelectContent>{countries.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select></CardContent></Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center"><CardTitle className="flex items-center gap-2"><MapIcon className="w-5 h-5 text-red-600" /> Edit Global Presence Content</CardTitle><Button onClick={handleSave} disabled={loading || saving} className="bg-red-600 hover:bg-red-700 text-white">{saving ? <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</span> : <span className="flex items-center"><Save className="w-4 h-4 mr-2" /> Save Changes</span>}</Button></CardHeader>
        <CardContent>
          {loading ? <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div> : (
            <form className="space-y-8">
              <div className="space-y-2"><Label>Title</Label><Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Global Presence" /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Our logistics network spans..." /></div>
              <div className="space-y-2"><Label>Button Text</Label><Input name="button_text" value={formData.button_text} onChange={handleChange} placeholder="Explore Our Global Network" /></div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default GlobalPresenceEditor;