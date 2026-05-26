import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Save, X, Activity, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface StatItem {
  id: string;
  country: string;
  value: string;
  label: string;
  icon: string;
  background_image: string | null;
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

const StatsEditor = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("singapore");
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [bgSaving, setBgSaving] = useState(false);
  const [bgImageFile, setBgImageFile] = useState<File | null>(null);
  const [bgImagePreview, setBgImagePreview] = useState<string | null>("/lovable-uploads/6fa84550-fe8c-4549-a9c9-c0f071c2cd75.png");

  const [formData, setFormData] = useState<Partial<StatItem>>({
    value: '',
    label: '',
    icon: 'CheckCircle',
    priority: 0,
    is_active: true
  });

  useEffect(() => {
    fetchStats();
  }, [selectedCountry]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_stats')
        .select('*')
        .eq('country', selectedCountry)
        .order('priority', { ascending: true });

      if (error) throw error;
      setStats(data || []);
      if (data && data.length > 0 && data[0].background_image) {
        setBgImagePreview(data[0].background_image);
      } else {
        setBgImagePreview("/lovable-uploads/6fa84550-fe8c-4549-a9c9-c0f071c2cd75.png");
      }
      setBgImageFile(null);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error fetching stats', description: error.message });
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

  const handleBgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBgImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setBgImagePreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBackground = async () => {
    if (!bgImageFile) return;
    setBgSaving(true);
    try {
      const fileExt = bgImageFile.name.split('.').pop();
      const fileName = `stats_bg_${selectedCountry}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('hero-images').upload(fileName, bgImageFile);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('hero-images').getPublicUrl(fileName);
      const finalBgImage = data.publicUrl;

      if (stats.length === 0) {
        const { error } = await supabase.from('homepage_stats').insert([{
          country: selectedCountry,
          value: 'bg-holder',
          label: 'Background Image Placeholder',
          background_image: finalBgImage,
          is_active: false
        }]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('homepage_stats').update({ background_image: finalBgImage }).eq('country', selectedCountry);
        if (error) throw error;
      }

      toast({ title: 'Success', description: 'Background image updated for all stats in this country.' });
      fetchStats();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setBgSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      value: '',
      label: '',
      icon: 'CheckCircle',
      priority: stats.length + 1,
      is_active: true
    });
    setEditingId(null);
  };

  const handleEdit = (stat: StatItem) => {
    setFormData(stat);
    setEditingId(stat.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;
    try {
      const { error } = await supabase.from('homepage_stats').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: 'Success', description: 'Stat deleted.' });
      fetchStats();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const currentBgImage = stats.length > 0 && stats[0].background_image 
        ? stats[0].background_image 
        : (bgImagePreview === "/lovable-uploads/6fa84550-fe8c-4549-a9c9-c0f071c2cd75.png" ? null : bgImagePreview);

      const payload = { 
        ...formData, 
        country: selectedCountry,
        background_image: currentBgImage 
      };
      
      if (editingId) {
        const { error } = await supabase.from('homepage_stats').update(payload).eq('id', editingId);
        if (error) throw error;
        
        toast({ title: 'Success', description: 'Stat updated successfully.' });
      } else {
        const { error } = await supabase.from('homepage_stats').insert([payload]);
        if (error) throw error;

        toast({ title: 'Success', description: 'Stat created successfully.' });
      }
      
      resetForm();
      fetchStats();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-red-600" /> Section Background Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/2 space-y-4">
              <Label htmlFor="background_image">Upload New Background</Label>
              <Input id="background_image" type="file" accept="image/*" onChange={handleBgImageChange} />
              <Button onClick={handleSaveBackground} disabled={bgSaving || !bgImageFile} className="bg-red-600 hover:bg-red-700 text-white">
                {bgSaving ? <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</span> : <span className="flex items-center"><Save className="w-4 h-4 mr-2" /> Save Background</span>}
              </Button>
            </div>
            <div className="w-full md:w-1/2 space-y-2">
              <Label>Current Background</Label>
              {bgImagePreview && (
                <div className="rounded-xl border border-slate-200 overflow-hidden w-full h-40 bg-slate-900">
                  <img src={bgImagePreview} alt="Preview" className="w-full h-full object-cover opacity-80" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            {editingId ? 'Edit Stat Item' : 'Add New Stat Item'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="value">Stat Value (e.g. 1M+) *</Label><Input id="value" name="value" value={formData.value} onChange={handleInputChange} placeholder="e.g. 1M+" required /></div>
              <div className="space-y-2"><Label htmlFor="label">Stat Label *</Label><Input id="label" name="label" value={formData.label} onChange={handleInputChange} placeholder="e.g. Deliveries Completed" required /></div>
              <div className="space-y-2"><Label htmlFor="icon">Icon Name (Lucide React) *</Label><Input id="icon" name="icon" value={formData.icon} onChange={handleInputChange} placeholder="e.g. FileCheck, Smile, Building2" required /></div>
              <div className="space-y-2"><Label htmlFor="priority">Display Order (Lower displays first) *</Label><Input id="priority" name="priority" type="number" value={formData.priority} onChange={handleInputChange} required /></div>
              <div className="flex items-center space-x-2 md:col-span-2 pt-4"><Checkbox id="is_active" checked={formData.is_active} onCheckedChange={handleCheckboxChange} /><Label htmlFor="is_active">Is Active (Visible on homepage)</Label></div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              {editingId && <Button type="button" variant="outline" onClick={resetForm}><X className="w-4 h-4 mr-2" /> Cancel</Button>}
              <Button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 text-white">
                {saving ? <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</span> : <span className="flex items-center"><Save className="w-4 h-4 mr-2" /> {editingId ? 'Update Stat' : 'Add Stat'}</span>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Existing Stats ({selectedCountry})</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.filter(s => s.value !== 'bg-holder').map((stat) => (
                <div key={stat.id} className={`border rounded-lg p-4 flex flex-col ${!stat.is_active ? 'opacity-60 bg-gray-50' : 'bg-white'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-3xl leading-tight">{stat.value}</h3>
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">Order #{stat.priority}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-4 flex-grow">{stat.label}</p>
                  <p className="text-xs font-mono text-gray-400 mb-4">Icon: {stat.icon}</p>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    <span className={`text-xs px-2 py-1 rounded-full ${stat.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {stat.is_active ? 'Active' : 'Disabled'}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(stat)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(stat.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default StatsEditor;