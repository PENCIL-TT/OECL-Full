import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Save, X, Globe } from 'lucide-react';

interface Country {
  id: string;
  name: string;
  company: string;
  website: string;
  priority: number;
  flag: string;
  slug: string;
  is_active: boolean;
}

const CountryEditor = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Country>>({
    name: '',
    company: 'OECL',
    website: '',
    priority: 0,
    flag: '',
    slug: '',
    is_active: true
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('priority', { ascending: true });

      if (error) throw error;
      setCountries(data || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error fetching countries',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'priority' ? parseInt(value) || 0 : value 
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      company: 'OECL',
      website: '',
      priority: countries.length + 1,
      flag: '',
      slug: '',
      is_active: true
    });
    setEditingId(null);
  };

  const handleEdit = (country: Country) => {
    setFormData(country);
    setEditingId(country.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this country?')) return;
    try {
      const { error } = await supabase.from('countries').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: 'Success', description: 'Country deleted.' });
      fetchCountries();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('countries')
          .update(formData)
          .eq('id', editingId);
        
        if (error) throw error;
        toast({ title: 'Success', description: 'Country updated successfully.' });
      } else {
        const { error } = await supabase
          .from('countries')
          .insert([formData]);
          
        if (error) throw error;
        toast({ title: 'Success', description: 'Country created successfully.' });
      }
      
      resetForm();
      fetchCountries();
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
            <Globe className="w-5 h-5 text-red-600" />
            {editingId ? 'Edit Country' : 'Add New Country'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Country Name (e.g. SINGAPORE) *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug (e.g. singapore) - leave empty for HQ</Label>
                <Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Entity Name (e.g. OECL, GC, GGL) *</Label>
                <Input id="company" name="company" value={formData.company} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Sorting Priority (1 is highest) *</Label>
                <Input id="priority" name="priority" type="number" value={formData.priority} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="website">Website Link *</Label>
                <Input id="website" name="website" value={formData.website} onChange={handleInputChange} placeholder="https://..." required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="flag">Flag URL or Path (e.g. /sg.svg) *</Label>
                <Input id="flag" name="flag" value={formData.flag} onChange={handleInputChange} placeholder="/country.svg" required />
              </div>
              <div className="flex items-center space-x-2 md:col-span-2 pt-2">
                <Checkbox id="is_active" checked={formData.is_active} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="is_active">Is Active (Visible in Header Dropdown)</Label>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : editingId ? 'Update Country' : 'Add Country'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Countries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countries.map((c) => (
              <div key={c.id} className={`border rounded-lg p-4 flex flex-col ${!c.is_active ? 'opacity-60 bg-gray-50' : 'bg-white'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 border bg-gray-100 flex items-center justify-center">
                      {c.flag ? <img src={c.flag} alt={c.name} className="w-full h-full object-cover" /> : <Globe className="w-4 h-4 text-gray-400"/>}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-none">{c.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{c.company}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">#{c.priority}</span>
                </div>
                
                <div className="text-sm text-gray-600 truncate mb-4">
                  {c.website}
                </div>
                
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <span className={`text-xs px-2 py-1 rounded-full ${c.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {c.is_active ? 'Active' : 'Hidden'}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(c)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

export default CountryEditor;