import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, RefreshCw, Mail, MapPin, Edit, Trash2, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OfficeLocation {
  id: string;
  country: string;
  country_code: string;
  city: string;
  address: string;
  phone: string;
  fax?: string;
  email: string;
  map_url: string;
  priority: number;
  is_active: boolean;
}

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

const ContactPageEditor = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("singapore");
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    recipient_emails: [] as string[],
    global_map_url: '',
  });

  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [editingLocId, setEditingLocId] = useState<string | null>(null);
  const [locFormData, setLocFormData] = useState<Partial<OfficeLocation>>({
    country: '', country_code: '', city: '', address: '', phone: '', fax: '',
    email: 'info@oecl.sg', map_url: '', priority: 0, is_active: true
  });

  useEffect(() => {
    fetchData();
  }, [selectedCountry]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: pageData, error: pageError } = await supabase
        .from('contact_page_content')
        .select('*')
        .eq('country', selectedCountry)
        .maybeSingle();

      if (pageError) throw pageError;
      if (pageData) {
        setFormData({
          title: pageData.title || '',
          subtitle: pageData.subtitle || '',
          recipient_emails: pageData.recipient_emails || [],
          global_map_url: pageData.global_map_url || '',
        });
      } else {
        setFormData({ title: '', subtitle: '', recipient_emails: [], global_map_url: '' });
      }

      const { data: locData, error: locError } = await supabase
        .from('office_locations').select('*').order('priority', { ascending: true });
        
      if (locError) throw locError;
      setLocations(locData || []);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error loading data", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (formData.global_map_url && formData.global_map_url.startsWith('http') && !formData.global_map_url.includes('embed')) {
      toast({ variant: "destructive", title: "Invalid Map URL", description: "Google Maps link must be an 'Embed' link (contains '/embed'). Please use the 'Embed a map' feature in Google Maps." });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('contact_page_content')
        .upsert({ country: selectedCountry, ...formData, updated_at: new Date().toISOString() }, { onConflict: 'country' });

      if (error) throw error;
      toast({ title: "Success", description: "Contact page settings updated." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleLocInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let finalValue = value;
    // Auto-extract src if the user accidentally pastes the entire iframe code
    if (name === 'map_url') {
      if (value.includes('<iframe')) {
        const match = value.match(/src="([^"]+)"/);
        if (match) finalValue = match[1];
      }
      finalValue = finalValue.replace(/\/maps\/d\/(?:u\/\d+\/)?(?:edit|viewer)\?/g, '/maps/d/embed?');
    }

    setLocFormData(prev => ({ ...prev, [name]: name === 'priority' ? Number(finalValue) : finalValue }));
  };

  const resetLocForm = () => {
    setLocFormData({
      country: '', country_code: '', city: '', address: '', phone: '', fax: '',
      email: 'info@oecl.sg', map_url: '', priority: locations.length + 1, is_active: true
    });
    setEditingLocId(null);
  };

  const handleEditLoc = (loc: OfficeLocation) => {
    setLocFormData(loc);
    setEditingLocId(loc.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteLoc = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
      const { error } = await supabase.from('office_locations').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Location deleted.' });
      fetchData();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleSaveLoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locFormData.map_url && locFormData.map_url.startsWith('http') && !locFormData.map_url.includes('embed')) {
      toast({ variant: "destructive", title: "Invalid Map URL", description: "Google Maps link must be an 'Embed' link (contains '/embed'). Please use the 'Embed a map' feature in Google Maps." });
      return;
    }

    setSaving(true);
    try {
      if (editingLocId) {
        const { error } = await supabase.from('office_locations').update(locFormData).eq('id', editingLocId);
        if (error) throw error;
        toast({ title: 'Success', description: 'Location updated.' });
      } else {
        const { error } = await supabase.from('office_locations').insert([locFormData]);
        if (error) throw error;
        toast({ title: 'Success', description: 'Location added.' });
      }
      resetLocForm();
      fetchData();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="w-6 h-6 text-red-600" />
        <h2 className="text-2xl font-bold">Contact Page Editor</h2>
      </div>

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

      <Tabs defaultValue="locations" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="locations">Countries & Map Locations</TabsTrigger>
          <TabsTrigger value="settings">Form Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader><CardTitle>Page Content & Recipients</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2"><Label>Page Title</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Get In Touch" /></div>
              <div className="space-y-2"><Label>Page Subtitle</Label><Textarea value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} rows={3} placeholder="e.g., We're here to help..." /></div>
              <div className="space-y-2">
                <Label>Default Recipient Emails</Label>
                <p className="text-sm text-gray-500">Enter emails separated by commas.</p>
                <Input value={formData.recipient_emails.join(', ')} onChange={(e) => setFormData({ ...formData, recipient_emails: e.target.value.split(',').map(email => email.trim()) })} placeholder="email1@example.com" />
              </div>
              <div className="space-y-2 pt-4 border-t">
                <Label>Global Presence Map URL</Label>
                <p className="text-sm text-gray-500">This is the Google "My Maps" embed URL for the main interactive map.</p>
                <Input value={formData.global_map_url || ''} onChange={(e) => {
                  let val = e.target.value;
                  if (val.includes('<iframe')) {
                    const match = val.match(/src="([^"]+)"/);
                    if (match) val = match[1];
                  }
                  val = val.replace(/\/maps\/d\/(?:u\/\d+\/)?(?:edit|viewer)\?/g, '/maps/d/embed?');
                  setFormData({ ...formData, global_map_url: val });
                }} placeholder="https://www.google.com/maps/d/u/0/embed?mid=..." />
                {formData.global_map_url && formData.global_map_url.includes('google.com/maps') && (
                  <div className="mt-4 border rounded-lg overflow-hidden h-[400px] bg-slate-50 w-full relative">
                    <iframe
                      key={formData.global_map_url}
                      src={formData.global_map_url}
                      className="w-full h-full"
                      style={{ border: 0, marginTop: '-50px' }}
                      allowFullScreen={false}
                      loading="lazy"
                      title="Global Map Preview"
                    ></iframe>
                  </div>
                )}
              </div>
              <Button onClick={handleSaveSettings} disabled={saving}>
                {saving ? <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</span> : <span className="flex items-center"><Save className="w-4 h-4 mr-2" /> Save Settings</span>}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                {editingLocId ? 'Edit Country Map Location' : 'Add New Country Map Location'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveLoc} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Country Assignment *</Label>
                    <Select 
                      value={locFormData.country_code || ''} 
                      onValueChange={(val) => {
                        const selected = countries.find(c => c.value === val);
                        if (selected) setLocFormData(prev => ({ ...prev, country_code: selected.value, country: selected.label }));
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                      <SelectContent>
                        {countries.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>City Name (e.g. Chennai)</Label><Input name="city" value={locFormData.city || ''} onChange={handleLocInputChange} required /></div>
                  
                  <div className="space-y-2"><Label>Priority (Sorting)</Label><Input type="number" name="priority" value={locFormData.priority} onChange={handleLocInputChange} /></div>
                  <div className="space-y-2"><Label>Phone Number(s)</Label><Input name="phone" value={locFormData.phone} onChange={handleLocInputChange} /></div>
                  <div className="space-y-2"><Label>Fax Number</Label><Input name="fax" value={locFormData.fax || ''} onChange={handleLocInputChange} /></div>
                  <div className="space-y-2"><Label>Email Address</Label><Input type="email" name="email" value={locFormData.email} onChange={handleLocInputChange} /></div>
                  
                  <div className="space-y-2 md:col-span-3"><Label>Full Address</Label><Textarea name="address" value={locFormData.address} onChange={handleLocInputChange} required /></div>
                  
                  <div className="space-y-2 md:col-span-3">
                    <Label>Google My Maps Embed URL (Provides the interactive map for this country)</Label>
                    <Input name="map_url" value={locFormData.map_url || ''} onChange={handleLocInputChange} placeholder="https://www.google.com/maps/d/embed?mid=..." />
                    <p className="text-xs text-gray-500 leading-relaxed">
                      For a single location, go to Google Maps, find a location, click "Share", then "Embed a map", and copy the `src` URL. <br /> For multiple markers, use a Google "My Maps" embed URL.
                    </p>
                    {locFormData.map_url && locFormData.map_url.includes('google.com/maps') && (
                      <div className="mt-2 border rounded-lg overflow-hidden aspect-video bg-slate-50">
                        <iframe
                          key={locFormData.map_url}
                          src={locFormData.map_url}
                          className="w-full h-full"
                          style={{ border: 0 }}
                          allowFullScreen={false}
                          loading="lazy"
                          title="Map Preview"
                        ></iframe>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 md:col-span-3 pt-2">
                    <Checkbox id="is_active" checked={locFormData.is_active} onCheckedChange={(c) => setLocFormData(prev => ({ ...prev, is_active: !!c }))} />
                    <Label htmlFor="is_active">Is Active (Visible on Maps & Contact Pages)</Label>
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  {editingLocId && <Button type="button" variant="outline" onClick={resetLocForm}><X className="w-4 h-4 mr-2" /> Cancel</Button>}
                  <Button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 text-white">
                    <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : editingLocId ? 'Update Map Location' : 'Add Map Location'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Existing Map Locations ({locations.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map((loc) => (
                  <div key={loc.id} className={`border rounded-lg p-4 flex flex-col ${!loc.is_active ? 'opacity-60 bg-gray-50' : 'bg-white'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <img src={`/${loc.country_code === 'usa' ? 'us' : loc.country_code}.svg`} alt="flag" className="w-6 h-6 object-cover rounded-sm shadow-sm" onError={(e) => (e.currentTarget.style.display='none')} />
                        <h3 className="font-bold text-lg leading-none">{loc.city}</h3>
                      </div>
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded">#{loc.priority}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-500 mb-2">{loc.country}</p>
                    <div className="text-sm text-gray-600 flex-1 mb-2 line-clamp-3 whitespace-pre-line">{loc.address}</div>
                    
                    {loc.map_url && (
                      <div className="mt-2 mb-4 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-100 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Map Configured
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                      <span className={`text-xs px-2 py-1 rounded-full ${loc.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {loc.is_active ? 'Active' : 'Hidden'}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditLoc(loc)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteLoc(loc.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactPageEditor;