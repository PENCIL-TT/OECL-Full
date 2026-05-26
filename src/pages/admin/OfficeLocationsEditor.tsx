import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Save, X, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OfficeLocation {
  id: string;
  country: string;
  country_code: string;
  country_lat: number;
  country_lng: number;
  city: string;
  city_lat: number;
  city_lng: number;
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

const OfficeLocationsEditor = () => {
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<OfficeLocation>>({
    country: '', country_code: '', country_lat: 0, country_lng: 0,
    city: '', city_lat: 0, city_lng: 0, address: '', phone: '', fax: '',
    email: 'info@oecl.sg', map_url: '', priority: 0, is_active: true
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('office_locations_global').select('*').order('priority', { ascending: true });
      if (error) throw error;
      setLocations(data || []);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const numericFields = ['country_lat', 'country_lng', 'city_lat', 'city_lng', 'priority'];
    setFormData(prev => ({ ...prev, [name]: numericFields.includes(name) ? Number(finalValue) : finalValue }));
  };

  const handleCheckboxChange = (checked: boolean) => setFormData(prev => ({ ...prev, is_active: checked }));

  const resetForm = () => {
    setFormData({
      country: '', country_code: '', country_lat: 0, country_lng: 0,
      city: '', city_lat: 0, city_lng: 0, address: '', phone: '', fax: '',
      email: 'info@oecl.sg', map_url: '', priority: locations.length + 1, is_active: true
    });
    setEditingId(null);
  };

  const handleEdit = (loc: OfficeLocation) => {
    setFormData(loc);
    setEditingId(loc.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
      const { error } = await supabase.from('office_locations_global').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Location deleted.' });
      fetchLocations();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        const { error } = await supabase.from('office_locations_global').update(formData).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Success', description: 'Location updated.' });
      } else {
        const { error } = await supabase.from('office_locations_global').insert([formData]);
        if (error) throw error;
        toast({ title: 'Success', description: 'Location added.' });
      }
      resetForm();
      fetchLocations();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            {editingId ? 'Edit Office Location' : 'Add New Office Location'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Country Assignment *</Label>
                <Select 
                  value={formData.country_code || ''} 
                  onValueChange={(val) => {
                    const selected = countries.find(c => c.value === val);
                    if (selected) setFormData(prev => ({ ...prev, country_code: selected.value, country: selected.label }));
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                  <SelectContent>
                    {countries.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>City Name (e.g. Chennai)</Label><Input name="city" value={formData.city || ''} onChange={handleInputChange} required /></div>
              
              <div className="space-y-2"><Label>Country Map Lat</Label><Input type="number" step="any" name="country_lat" value={formData.country_lat} onChange={handleInputChange} required /></div>
              <div className="space-y-2"><Label>Country Map Lng</Label><Input type="number" step="any" name="country_lng" value={formData.country_lng} onChange={handleInputChange} required /></div>
              <div className="space-y-2"><Label>Priority (Sorting)</Label><Input type="number" name="priority" value={formData.priority} onChange={handleInputChange} /></div>

              <div className="space-y-2"><Label>City Map Lat</Label><Input type="number" step="any" name="city_lat" value={formData.city_lat} onChange={handleInputChange} /></div>
              <div className="space-y-2"><Label>City Map Lng</Label><Input type="number" step="any" name="city_lng" value={formData.city_lng} onChange={handleInputChange} /></div>
              <div className="space-y-2"><Label>Phone Number(s)</Label><Input name="phone" value={formData.phone} onChange={handleInputChange} /></div>
              <div className="space-y-2"><Label>Fax Number</Label><Input name="fax" value={formData.fax || ''} onChange={handleInputChange} /></div>
              
              <div className="space-y-2 md:col-span-3"><Label>Full Address</Label><Textarea name="address" value={formData.address} onChange={handleInputChange} required /></div>
              
              <div className="space-y-2 md:col-span-1"><Label>Email Address</Label><Input type="email" name="email" value={formData.email} onChange={handleInputChange} /></div>
              <div className="space-y-2 md:col-span-2">
                <Label>Google My Maps Embed URL (Used in Contact Page)</Label>
                <Input name="map_url" value={formData.map_url} onChange={handleInputChange} placeholder="https://www.google.com/maps/d/embed?..." />
                {formData.map_url && formData.map_url.includes('google.com/maps') && (
                  <div className="mt-2 border rounded-lg overflow-hidden aspect-video bg-slate-50">
                    <iframe
                      key={formData.map_url}
                      src={formData.map_url}
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
                <Checkbox id="is_active" checked={formData.is_active} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="is_active">Is Active (Visible on Global Presence / Contact Pages)</Label>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              {editingId && <Button type="button" variant="outline" onClick={resetForm}><X className="w-4 h-4 mr-2" /> Cancel</Button>}
              <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
                <Save className="w-4 h-4 mr-2" /> {loading ? 'Saving...' : editingId ? 'Update Location' : 'Add Location'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Existing Locations</CardTitle></CardHeader>
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
                <div className="text-sm text-gray-600 flex-1 mb-4 line-clamp-3 whitespace-pre-line">{loc.address}</div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className={`text-xs px-2 py-1 rounded-full ${loc.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {loc.is_active ? 'Active' : 'Hidden'}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(loc)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(loc.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default OfficeLocationsEditor;