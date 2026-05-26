import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Link as LinkIcon } from "lucide-react";

const countries = [
  { value: "singapore", label: "Singapore" },
  { value: "india", label: "India" },
  { value: "malaysia", label: "Malaysia" },
  { value: "thailand", label: "Thailand" },
  { value: "indonesia", label: "Indonesia" },
];

const PortalLinksEditor = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("singapore");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customer_portal_title: 'Customer Portal',
    customer_portal_url: '',
    partner_portal_title: 'Partner Portal',
    partner_portal_url: '',
    tracking_title: 'Tracking',
    tracking_url: '',
    sailing_schedule_title: 'Sailing Schedule',
    sailing_schedule_url: ''
  });

  useEffect(() => {
    fetchLinks();
  }, [selectedCountry]);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("portal_links")
        .select("*")
        .eq("country", selectedCountry)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          customer_portal_title: data.customer_portal_title || 'Customer Portal',
          customer_portal_url: data.customer_portal_url || '',
          partner_portal_title: data.partner_portal_title || 'Partner Portal',
          partner_portal_url: data.partner_portal_url || '',
          tracking_title: data.tracking_title || 'Tracking',
          tracking_url: data.tracking_url || '',
          sailing_schedule_title: data.sailing_schedule_title || 'Sailing Schedule',
          sailing_schedule_url: data.sailing_schedule_url || ''
        });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error fetching data", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("portal_links")
        .upsert({ 
          country: selectedCountry,
          ...formData,
          updated_at: new Date().toISOString() 
        }, { onConflict: 'country' });

      if (error) throw error;
      toast({ title: "Success", description: "Portal Links updated successfully!" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error saving links", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader><CardTitle>Select Country Context</CardTitle></CardHeader>
        <CardContent>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Select country" /></SelectTrigger>
            <SelectContent>
              {countries.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="flex items-center gap-2"><LinkIcon className="h-5 w-5 text-red-600" /> Quick Portal Links</CardTitle>
          <Button onClick={handleSave} disabled={loading || saving} className="bg-red-600 hover:bg-red-700 text-white">
            {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Links
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 p-4 border rounded-xl bg-slate-50">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Customer Portal</h3>
                <div><Label>Title</Label><Input name="customer_portal_title" value={formData.customer_portal_title} onChange={handleChange} className="mt-1 bg-white" /></div>
                <div><Label>URL</Label><Input name="customer_portal_url" value={formData.customer_portal_url} onChange={handleChange} className="mt-1 bg-white" /></div>
              </div>
              <div className="space-y-4 p-4 border rounded-xl bg-slate-50">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Partner Portal</h3>
                <div><Label>Title</Label><Input name="partner_portal_title" value={formData.partner_portal_title} onChange={handleChange} className="mt-1 bg-white" /></div>
                <div><Label>URL</Label><Input name="partner_portal_url" value={formData.partner_portal_url} onChange={handleChange} className="mt-1 bg-white" /></div>
              </div>
              <div className="space-y-4 p-4 border rounded-xl bg-slate-50">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Tracking</h3>
                <div><Label>Title</Label><Input name="tracking_title" value={formData.tracking_title} onChange={handleChange} className="mt-1 bg-white" /></div>
                <div><Label>URL</Label><Input name="tracking_url" value={formData.tracking_url} onChange={handleChange} className="mt-1 bg-white" /></div>
              </div>
              <div className="space-y-4 p-4 border rounded-xl bg-slate-50">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Sailing Schedule</h3>
                <div><Label>Title</Label><Input name="sailing_schedule_title" value={formData.sailing_schedule_title} onChange={handleChange} className="mt-1 bg-white" /></div>
                <div><Label>URL</Label><Input name="sailing_schedule_url" value={formData.sailing_schedule_url} onChange={handleChange} className="mt-1 bg-white" /></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalLinksEditor;