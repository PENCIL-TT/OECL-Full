import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Upload, Edit, Image as ImageIcon } from "lucide-react";

interface HeroSlide {
  id: string;
  country: string;
  title: string;
  description: string | null;
  image_url: string;
  priority: number;
  is_active: boolean;
}

const countries = [
  { value: "singapore", label: "Singapore" },
  { value: "india", label: "India" },
  { value: "malaysia", label: "Malaysia" },
  { value: "thailand", label: "Thailand" },
  { value: "indonesia", label: "Indonesia" },
];

const HeroEditor = () => {
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const { toast } = useToast();

  const [selectedCountry, setSelectedCountry] = useState("singapore");
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    country: "singapore",
    priority: 0,
    file: null as File | null,
  });

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: 0,
    file: null as File | null,
  });

  useEffect(() => {
    fetchSlides();
  }, [selectedCountry]);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('country', selectedCountry)
        .order('priority', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error fetching slides", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.title) {
      toast({ variant: "destructive", title: "Missing fields", description: "Provide a title and an image." });
      return;
    }

    setUploadLoading(true);
    try {
      const fileExt = uploadForm.file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${uploadForm.country}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(filePath, uploadForm.file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('hero-images')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('hero_slides')
        .insert({
          country: uploadForm.country,
          title: uploadForm.title,
          description: uploadForm.description || null,
          priority: uploadForm.priority,
          image_url: publicUrl,
          is_active: true,
        });

      if (dbError) throw dbError;

      toast({ title: "Slide uploaded successfully!" });
      setUploadForm({ title: "", description: "", country: "singapore", priority: 0, file: null });
      
      if (uploadForm.country === selectedCountry) {
        fetchSlides();
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload failed", description: error.message });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setEditForm({
      title: slide.title,
      description: slide.description || '',
      priority: slide.priority || 0,
      file: null,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    try {
      let updatedImageUrl = editingSlide.image_url;

      // If the user selected a new image file, upload it to storage first
      if (editForm.file) {
        const fileExt = editForm.file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${editingSlide.country}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('hero-images')
          .upload(filePath, editForm.file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('hero-images')
          .getPublicUrl(filePath);

        updatedImageUrl = publicUrl;
      }

      const { error } = await supabase
        .from('hero_slides')
        .update({
          title: editForm.title,
          description: editForm.description,
          priority: editForm.priority,
          image_url: updatedImageUrl,
        })
        .eq('id', editingSlide.id);

      if (error) throw error;

      toast({ title: "Success", description: "Slide details updated." });
      setEditingSlide(null);
      fetchSlides();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update failed", description: error.message });
    }
  };

  const handleDelete = async (slide: HeroSlide) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      // Note: In a robust setup, you might also want to delete the image from storage here.
      const { error: dbError } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', slide.id);

      if (dbError) throw dbError;

      toast({ title: "Success", description: "Slide deleted successfully." });
      fetchSlides();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Delete failed", description: error.message });
    }
  };

  const toggleVisibility = async (slide: HeroSlide) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ is_active: !slide.is_active })
        .eq('id', slide.id);

      if (error) throw error;
      fetchSlides();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update failed", description: error.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Select Country Context */}
      <Card>
        <CardHeader>
          <CardTitle>Select Country to Manage Slides</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Upload New Slide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Slide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title *</Label>
                <Input value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} required />
              </div>
              <div>
                <Label>Country *</Label>
                <Select value={uploadForm.country} onValueChange={(value) => setUploadForm({ ...uploadForm, country: value })}>
                  <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={uploadForm.description} onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Priority (Lower displays first)</Label>
                <Input type="number" value={uploadForm.priority} onChange={(e) => setUploadForm({ ...uploadForm, priority: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label>Image File *</Label>
                <Input type="file" accept="image/*" onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })} required />
              </div>
            </div>
            <Button type="submit" disabled={uploadLoading} className="w-full">
              {uploadLoading ? "Uploading..." : "Upload Slide"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Slides */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Slides ({slides.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin h-8 w-8 border-b-2 border-red-600 rounded-full"></div></div>
          ) : slides.length === 0 ? (
            <div className="text-center py-8 text-gray-500"><ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" /><p>No slides found for {selectedCountry}</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slides.map((slide) => (
                <div key={slide.id} className={`border rounded-lg overflow-hidden ${!slide.is_active ? 'opacity-60' : ''}`}>
                  <div className="aspect-video relative bg-slate-100">
                    <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Priority: {slide.priority}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{slide.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{slide.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={slide.is_active} onCheckedChange={() => toggleVisibility(slide)} />
                        <span className="text-sm font-medium">Active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(slide)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(slide)} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Slide Modal */}
      {editingSlide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Slide</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} />
                </div>
                <div>
                  <Label>Priority (Lower displays first)</Label>
                  <Input type="number" value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label>Replace Image (Leave empty to keep current)</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setEditForm({ ...editForm, file: e.target.files?.[0] || null })} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingSlide(null)}>Cancel</Button>
                  <Button type="submit">Update</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HeroEditor;