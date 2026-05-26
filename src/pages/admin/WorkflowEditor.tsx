import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Save, X, ClipboardCheck, RefreshCw } from 'lucide-react';

interface WorkflowStep {
  id: string;
  country: string;
  title: string;
  description: string;
  icon: string;
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

const WorkflowEditor = () => {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("singapore");
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<WorkflowStep>>({
    title: '',
    description: '',
    icon: 'CheckCircle',
    priority: 0,
    is_active: true
  });

  useEffect(() => {
    fetchSteps();
  }, [selectedCountry]);

  const fetchSteps = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_workflow')
        .select('*')
        .eq('country', selectedCountry)
        .order('priority', { ascending: true });

      if (error) throw error;
      setSteps(data || []);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error fetching workflow steps', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      title: '',
      description: '',
      icon: 'CheckCircle',
      priority: steps.length + 1,
      is_active: true
    });
    setEditingId(null);
  };

  const handleEdit = (step: WorkflowStep) => {
    setFormData(step);
    setEditingId(step.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workflow step?')) return;
    try {
      const { error } = await supabase.from('homepage_workflow').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: 'Success', description: 'Workflow step deleted.' });
      fetchSteps();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData, country: selectedCountry };
      
      if (editingId) {
        const { error } = await supabase.from('homepage_workflow').update(payload).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Success', description: 'Workflow step updated successfully.' });
      } else {
        const { error } = await supabase.from('homepage_workflow').insert([payload]);
        if (error) throw error;
        toast({ title: 'Success', description: 'Workflow step created successfully.' });
      }
      
      resetForm();
      fetchSteps();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Select Country */}
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
            <ClipboardCheck className="w-5 h-5 text-red-600" />
            {editingId ? 'Edit Workflow Step' : 'Add New Workflow Step'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Step Title *</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Order Processing" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Name (Lucide React) *</Label>
                <Input id="icon" name="icon" value={formData.icon} onChange={handleInputChange} placeholder="e.g. ClipboardCheck, Package, Truck, CheckCircle" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={2} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Display Order (Lower displays first) *</Label>
                <Input id="priority" name="priority" type="number" value={formData.priority} onChange={handleInputChange} required />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Checkbox id="is_active" checked={formData.is_active} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="is_active">Is Active (Visible on homepage)</Label>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
              )}
              <Button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 text-white">
                {saving ? <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</span> : <span className="flex items-center"><Save className="w-4 h-4 mr-2" /> {editingId ? 'Update Step' : 'Add Step'}</span>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Existing Workflow Steps</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {steps.map((step) => (
                <div key={step.id} className={`border rounded-lg p-4 flex flex-col ${!step.is_active ? 'opacity-60 bg-gray-50' : 'bg-white'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg leading-tight">{step.title}</h3>
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">Order #{step.priority}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{step.description}</p>
                  <p className="text-xs font-mono text-gray-400 mb-4">Icon: {step.icon}</p>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    <span className={`text-xs px-2 py-1 rounded-full ${step.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{step.is_active ? 'Active' : 'Disabled'}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(step)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(step.id)}><Trash2 className="w-4 h-4" /></Button>
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
export default WorkflowEditor;