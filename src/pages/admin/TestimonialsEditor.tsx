import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, MessageSquare } from "lucide-react";
import { Checkbox } from '@/components/ui/checkbox';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  quote: string;
  avatar_url: string;
  avatar_path: string;
  priority: number;
  is_active: boolean;
  country: string;
}

const countries = [
  { value: "singapore", label: "Singapore" },
  { value: "india", label: "India" },
  { value: "malaysia", label: "Malaysia" },
  { value: "thailand", label: "Thailand" },
  { value: "indonesia", label: "Indonesia" },
];

const TestimonialsEditor = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("singapore");
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    position: "",
    quote: "",
    priority: 0,
    file: null as File | null,
  });

  useEffect(() => {
    fetchTestimonials();
  }, [selectedCountry]);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('testimonials').select('*').eq('country', selectedCountry).order('priority', { ascending: true });
      if (error) throw error;
      setTestimonials(data || []);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error fetching testimonials", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setForm({
      name: testimonial.name,
      position: testimonial.position,
      quote: testimonial.quote,
      priority: testimonial.priority,
      file: null,
    });
  };

  const resetForm = () => {
    setEditingTestimonial(null);
    setForm({ name: "", position: "", quote: "", priority: 0, file: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let avatarUrl = editingTestimonial?.avatar_url || '';
      let avatarPath = editingTestimonial?.avatar_path || '';

      if (form.file) {
        const fileExt = form.file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('testimonial-avatars').upload(filePath, form.file, { upsert: true });
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('testimonial-avatars').getPublicUrl(filePath);
        avatarUrl = publicUrl;
        avatarPath = filePath;
      }

      const testimonialData = {
        name: form.name,
        position: form.position,
        quote: form.quote,
        priority: form.priority,
        avatar_url: avatarUrl,
        avatar_path: avatarPath,
        country: selectedCountry,
      };

      const { error } = editingTestimonial
        ? await supabase.from('testimonials').update(testimonialData).eq('id', editingTestimonial.id)
        : await supabase.from('testimonials').insert([testimonialData]);

      if (error) throw error;
      toast({ title: `Testimonial ${editingTestimonial ? 'updated' : 'created'} successfully` });
      resetForm();
      fetchTestimonials();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (testimonial: Testimonial) => {
    if (!confirm('Are you sure?')) return;
    try {
      if (testimonial.avatar_path) {
        await supabase.storage.from('testimonial-avatars').remove([testimonial.avatar_path]);
      }
      await supabase.from('testimonials').delete().eq('id', testimonial.id);
      toast({ title: "Testimonial deleted" });
      fetchTestimonials();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Delete failed", description: error.message });
    }
  };

  return (
    <div className="space-y-6">
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
            <MessageSquare className="w-5 h-5 text-red-600" />
            {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Position & Company *</Label>
                <Input
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="e.g. CEO, Tech Logistics"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Quote *</Label>
                <Textarea
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Display Priority (Lower shows first) *</Label>
                <Input
                  type="number"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Avatar Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              {editingTestimonial && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
                {loading ? 'Saving...' : editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Existing Testimonials for {selectedCountry}</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          ) : testimonials.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No testimonials found. Add one above.</div>
          ) : (
          <div className="space-y-4">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <img src={testimonial.avatar_url} alt={testimonial.name} className="w-16 h-16 object-cover rounded-full" />
                  <div>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.position}</p>
                    <p className="text-sm text-gray-500 italic mt-1 line-clamp-1">"{testimonial.quote}"</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(testimonial)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(testimonial)}><Trash2 className="h-4 w-4" /></Button>
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

export default TestimonialsEditor;