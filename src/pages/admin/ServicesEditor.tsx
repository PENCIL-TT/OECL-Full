import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Save, X, PlusCircle } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  slug: string;
  button_text: string;
  is_enabled: boolean;
  priority: number;
}

const ServicesEditor = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    icon: 'Box',
    image: '',
    slug: '',
    button_text: 'Learn More',
    is_enabled: true,
    priority: 99
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('priority', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error fetching services',
        description: error.message,
      });
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
    setFormData((prev) => ({ ...prev, is_enabled: checked }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: 'Box',
      image: '',
      slug: '',
      button_text: 'Learn More',
      is_enabled: true,
      priority: services.length + 1
    });
    setEditingId(null);
    setImageFile(null);
  };

  const handleEdit = (service: Service) => {
    setFormData({
      ...service
    });
    setEditingId(service.id);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: 'Success', description: 'Service deleted.' });
      fetchServices();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = formData.image;

      // Upload the image to Supabase if a new file was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `service-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('hero-images')
          .upload(`services/${fileName}`, imageFile, { upsert: true });

        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage
          .from('hero-images')
          .getPublicUrl(`services/${fileName}`);
        finalImageUrl = publicUrl;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        slug: formData.slug,
        button_text: formData.button_text,
        is_enabled: formData.is_enabled,
        priority: formData.priority,
        image: finalImageUrl
      };

      if (editingId) {
        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', editingId);
        
        if (error) throw error;
        toast({ title: 'Success', description: 'Service updated successfully.' });
      } else {
        const { error } = await supabase
          .from('services')
          .insert([payload]);
          
        if (error) throw error;
        toast({ title: 'Success', description: 'Service added successfully.' });
      }
      
      resetForm();
      fetchServices();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Shared form renderer to avoid duplicate code
  const renderServiceForm = (isEdit: boolean) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug *</Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon">Icon Name (Lucide React) *</Label>
          <Input
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleInputChange}
            placeholder="e.g., Truck, Plane, Ship, Box"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="button_text">Button Text</Label>
          <Input
            id="button_text"
            name="button_text"
            value={formData.button_text}
            onChange={handleInputChange}
            placeholder="e.g., Learn More"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Display Priority (1-9) *</Label>
          <Input
            id="priority"
            name="priority"
            type="number"
            value={formData.priority}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="image">Service Image *</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          {(imageFile ? URL.createObjectURL(imageFile) : formData.image) && (
            <div className="mt-2 h-32 w-full max-w-sm rounded-lg overflow-hidden border bg-slate-50">
              <img 
                src={imageFile ? URL.createObjectURL(imageFile) : formData.image} 
                alt="Preview" 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Short Description (for homepage/service list) *</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={2}
            required
          />
        </div>
        <div className="flex items-center space-x-2 md:col-span-2">
          <Checkbox
            id="is_enabled"
            checked={formData.is_enabled}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="is_enabled">Is Enabled (visible on website)</Label>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        {isEdit && (
          <Button type="button" variant="outline" onClick={resetForm}>
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading} className={!isEdit ? "bg-red-600 hover:bg-red-700 text-white" : ""}>
          {isEdit ? <Edit className="w-4 h-4 mr-2" /> : <PlusCircle className="w-4 h-4 mr-2" />}
          {loading ? 'Saving...' : isEdit ? 'Update Service' : 'Add New Service'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <Card className="border-red-100 shadow-md">
        <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
          <CardTitle>{editingId ? 'Edit Service' : 'Add New Service'}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {renderServiceForm(!!editingId)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service.id} className={`border rounded-lg p-4 flex flex-col ${!service.is_enabled ? 'opacity-60 bg-gray-50' : ''}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {service.image ? (
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-200" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{service.title}</h3>
                    <p className="text-xs text-gray-500 font-mono">/{service.slug}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2 py-1 rounded-md">#{service.priority}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{service.description}</p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <span className={`text-xs px-2 py-1 rounded-full ${service.is_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {service.is_enabled ? 'Active' : 'Disabled'}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(service.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {services.length === 0 && !loading && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No services found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesEditor;