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
import { Trash2, Upload, Edit, Image } from "lucide-react";

interface GalleryImage {
  id: string;
  country: string;
  title: string;
  description: string | null;
  label: string | null;
  image_url: string;
  image_path: string;
  created_at: string;
  updated_at: string;
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

const GalleryEditor = () => {
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const { toast } = useToast();

  const [selectedCountry, setSelectedCountry] = useState("singapore");
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  const [galleryUploadForm, setGalleryUploadForm] = useState({
    title: "",
    description: "",
    country: "singapore",
    label: "",
    file: null as File | null,
  });

  const [galleryEditForm, setGalleryEditForm] = useState({
    title: "",
    description: "",
    label: "",
    file: null as File | null,
  });

  useEffect(() => {
    fetchGalleryImages();
  }, [selectedCountry]);

  const fetchGalleryImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('country', selectedCountry)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGalleryImages(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching images",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryUploadForm.file || !galleryUploadForm.title) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please provide both title and image file",
      });
      return;
    }

    setUploadLoading(true);
    try {
      const fileExt = galleryUploadForm.file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${galleryUploadForm.country}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(`gallery-${galleryUploadForm.country}`)
        .upload(filePath, galleryUploadForm.file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(`gallery-${galleryUploadForm.country}`)
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('gallery')
        .insert({
          country: galleryUploadForm.country,
          title: galleryUploadForm.title,
          description: galleryUploadForm.description || null,
          label: galleryUploadForm.label || null,
          image_url: publicUrl,
          image_path: filePath,
        });

      if (dbError) throw dbError;

      toast({
        title: "Image uploaded successfully",
        description: "The image has been added to the gallery",
      });

      setGalleryUploadForm({ title: "", description: "", country: "singapore", label: "", file: null });
      if (galleryUploadForm.country === selectedCountry) {
        fetchGalleryImages();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleGalleryEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setGalleryEditForm({
      title: image.title,
      description: image.description || '',
      label: image.label || '',
      file: null,
    });
  };

  const handleUpdateGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    try {
      let updatedImageUrl = editingImage.image_url;
      let updatedImagePath = editingImage.image_path;

      // If the user selected a new image file, upload it to storage first
      if (galleryEditForm.file) {
        const fileExt = galleryEditForm.file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${editingImage.country}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(`gallery-${editingImage.country}`)
          .upload(filePath, galleryEditForm.file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(`gallery-${editingImage.country}`)
          .getPublicUrl(filePath);

        updatedImageUrl = publicUrl;
        updatedImagePath = filePath;
      }

      const { error } = await supabase
        .from('gallery')
        .update({
          title: galleryEditForm.title,
          description: galleryEditForm.description,
          label: galleryEditForm.label,
          image_url: updatedImageUrl,
          image_path: updatedImagePath,
        })
        .eq('id', editingImage.id);

      if (error) throw error;

      toast({ title: "Success", description: "Image details updated." });
      setEditingImage(null);
      fetchGalleryImages();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update failed", description: error.message });
    }
  };

  const handleGalleryDelete = async (image: GalleryImage) => {
    if (!confirm('Are you sure you want to delete this image? This will also remove it from storage.')) return;

    try {
      const { error: storageError } = await supabase.storage
        .from(`gallery-${image.country}`)
        .remove([image.image_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', image.id);

      if (dbError) throw dbError;

      toast({ title: "Success", description: "Image deleted successfully." });
      fetchGalleryImages();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Delete failed", description: error.message });
    }
  };

  const toggleGalleryVisibility = async (image: GalleryImage) => {
    const newLabel = image.label === 'private' ? null : 'private';
    try {
      const { error } = await supabase
        .from('gallery')
        .update({ label: newLabel })
        .eq('id', image.id);

      if (error) throw error;

      toast({ title: "Visibility updated" });
      fetchGalleryImages();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update failed", description: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Country</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGalleryFileUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={galleryUploadForm.title}
                  onChange={(e) => setGalleryUploadForm({ ...galleryUploadForm, title: e.target.value })}
                  placeholder="Enter image title"
                  required
                />
              </div>
              <div>
                <Label>Country *</Label>
                <Select 
                  value={galleryUploadForm.country} 
                  onValueChange={(value) => setGalleryUploadForm({ ...galleryUploadForm, country: value })}
                >
                  <SelectTrigger>
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
              </div>
            </div>
            
            <div>
              <Label>Description (Optional)</Label>
              <Textarea
                value={galleryUploadForm.description}
                onChange={(e) => setGalleryUploadForm({ ...galleryUploadForm, description: e.target.value })}
                placeholder="Enter image description"
                rows={3}
              />
            </div>
            
            <div>
              <Label>Label (Optional)</Label>
              <Input
                value={galleryUploadForm.label}
                onChange={(e) => setGalleryUploadForm({ ...galleryUploadForm, label: e.target.value })}
                placeholder="e.g., private (to hide from public)"
              />
            </div>
            
            <div>
              <Label>Image File *</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setGalleryUploadForm({ ...galleryUploadForm, file: e.target.files?.[0] || null })}
                required
              />
            </div>
            
            <Button type="submit" disabled={uploadLoading} className="w-full">
              {uploadLoading ? "Uploading..." : "Upload Image"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCountry.charAt(0).toUpperCase() + selectedCountry.slice(1)} Gallery ({galleryImages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No images found for {selectedCountry}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div key={image.id} className="border rounded-lg overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-48 object-fill"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{image.title}</h3>
                    {image.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{image.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={image.label === 'private'}
                          onCheckedChange={() => toggleGalleryVisibility(image)}
                        />
                        <span className="text-sm">Hide from public</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGalleryEdit(image)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGalleryDelete(image)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Image</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateGalleryImage} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={galleryEditForm.title}
                    onChange={(e) => setGalleryEditForm({ ...galleryEditForm, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={galleryEditForm.description}
                    onChange={(e) => setGalleryEditForm({ ...galleryEditForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Label</Label>
                  <Input
                    value={galleryEditForm.label}
                    onChange={(e) => setGalleryEditForm({ ...galleryEditForm, label: e.target.value })}
                    placeholder="e.g., private"
                  />
                </div>
                <div>
                  <Label>Replace Image (Leave empty to keep current)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGalleryEditForm({ ...galleryEditForm, file: e.target.files?.[0] || null })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingImage(null)}
                  >
                    Cancel
                  </Button>
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

export default GalleryEditor;