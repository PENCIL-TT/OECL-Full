import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Save, RefreshCw, Send } from 'lucide-react';

const countries = [
  { value: "singapore", label: "Singapore" },
  { value: "india", label: "India" },
  { value: "malaysia", label: "Malaysia" },
  { value: "thailand", label: "Thailand" },
  { value: "indonesia", label: "Indonesia" },
];

const ContactFormEditor = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("singapore");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    form_title: "",
    form_subtitle: "",
    button_text: "",
    success_message: "",
  });

  useEffect(() => {
    fetchData();
  }, [selectedCountry]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_form_settings')
        .select('*')
        .eq('country', selectedCountry)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          form_title: data.form_title || "Send us a Message",
          form_subtitle: data.form_subtitle || "Fill out the form below and we'll get back to you within 24 hours.",
          button_text: data.button_text || "Send Message",
          success_message: data.success_message || "Your message has been sent successfully. We'll get back to you soon!",
        });
      } else {
        setFormData({
          form_title: "Send us a Message",
          form_subtitle: "Fill out the form below and we'll get back to you within 24 hours.",
          button_text: "Send Message",
          success_message: "Your message has been sent successfully. We'll get back to you soon!",
        });
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
      const { error } = await supabase.from('contact_form_settings').upsert(payload, { onConflict: 'country' });
      if (error) throw error;

      toast({ title: "Success", description: "Contact Form texts updated successfully!" });
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
        <CardHeader className="flex flex-row justify-between items-center"><CardTitle className="flex items-center gap-2"><Send className="w-5 h-5 text-red-600" /> Edit Contact Form Texts</CardTitle><Button onClick={handleSave} disabled={loading || saving} className="bg-red-600 hover:bg-red-700 text-white">{saving ? <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</span> : <span className="flex items-center"><Save className="w-4 h-4 mr-2" /> Save Changes</span>}</Button></CardHeader>
        <CardContent>{loading ? <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div> : (<form className="space-y-8"><div className="space-y-2"><Label>Form Title</Label><Input name="form_title" value={formData.form_title} onChange={handleChange} placeholder="e.g. Send us a Message" /></div><div className="space-y-2"><Label>Form Subtitle / Instructions</Label><Textarea name="form_subtitle" value={formData.form_subtitle} onChange={handleChange} rows={3} placeholder="Fill out the form below..." /></div><div className="space-y-2"><Label>Submit Button Text</Label><Input name="button_text" value={formData.button_text} onChange={handleChange} placeholder="e.g. Send Message" /></div><div className="space-y-2"><Label>Success Message</Label><Input name="success_message" value={formData.success_message} onChange={handleChange} placeholder="Your message has been sent..." /></div></form>)}</CardContent>
      </Card>
    </div>
  );
};
export default ContactFormEditor;