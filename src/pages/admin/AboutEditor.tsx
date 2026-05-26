import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Bold, Italic, Underline, Link as LinkIcon, List, Upload, Image as ImageIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DEFAULT_TITLE = "About OECL";
const DEFAULT_MISSION = "We provide efficient, cost-effective, and innovative global logistics solutions with end-to-end service packages.";
const DEFAULT_VISION = "To deliver the highest quality service and be known for being the most customer-focused logistics company.";
const DEFAULT_CONTENT = `Established in 2008 and headquartered in Singapore, OECL is a premier global logistics and supply chain partner founded by experienced professionals. With over 30 years of service across various industries, the company is known for its passionate and efficient delivery of world-class logistics solutions.

Global Expansion Driven by Innovation and Excellence:
OECL's growth is driven by a dedicated team, simplified processes, and advanced technology, enabling global office expansion. The company is well-positioned to meet international market demands and has firm plans to expand further across Southeast Asia.`;

const countries = [
  { value: "singapore", label: "Singapore" },
  { value: "india", label: "India" },
  { value: "malaysia", label: "Malaysia" },
  { value: "thailand", label: "Thailand" },
  { value: "indonesia", label: "Indonesia" },
];

export default function AboutEditor() {
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("singapore");
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [mission, setMission] = useState(DEFAULT_MISSION);
  const [vision, setVision] = useState(DEFAULT_VISION);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  
  // New features state
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchAboutContent();
  }, [selectedCountry]);

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .eq("country", selectedCountry)
        .maybeSingle();
        
      if (data) {
        setTitle(data.title || DEFAULT_TITLE);
        setMission(data.mission || DEFAULT_MISSION);
        setVision(data.vision || DEFAULT_VISION);
        setContent(data.content || DEFAULT_CONTENT);
        if (data.image_url) {
          setImagePreview(data.image_url);
        } else {
          setImagePreview(null);
        }
      } else {
        setTitle(DEFAULT_TITLE);
        setMission(DEFAULT_MISSION);
        setVision(DEFAULT_VISION);
        setContent(DEFAULT_CONTENT);
        setImagePreview(null);
      }
    } catch (error) {
      console.log("No existing about content found or error fetching.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `about_${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('gallery-singapore').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('gallery-singapore').getPublicUrl(fileName);
    return data.publicUrl;
  };

  // Rich Text Formatting Functions
  const insertTextAtCursor = (beforeText: string, afterText: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText = beforeText + selectedText + afterText;
    setContent(content.substring(0, start) + newText + content.substring(end));
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + beforeText.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleBold = () => insertTextAtCursor('**', '**');
  const handleItalic = () => insertTextAtCursor('*', '*');
  const handleUnderline = () => insertTextAtCursor('<u>', '</u>');
  const handleBulletList = () => insertTextAtCursor('\n- ');
  
  const handleLink = () => {
    const textarea = contentRef.current;
    if (!textarea) return;
    setLinkText(textarea.value.substring(textarea.selectionStart, textarea.selectionEnd));
    setShowLinkDialog(true);
  };

  const insertLink = () => {
    if (!linkUrl) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a URL" });
      return;
    }
    const linkMarkdown = `${linkText || linkUrl}`;
    insertTextAtCursor(linkMarkdown);
    setShowLinkDialog(false);
    setLinkUrl('');
    setLinkText('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = imagePreview;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase
        .from("about_content")
        .upsert({ 
          country: selectedCountry,
          title, 
          mission, 
          vision, 
          content, 
          image_url: finalImageUrl,
          updated_at: new Date().toISOString() 
        }, { onConflict: 'country' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "About Us content updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving content",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Country Context</CardTitle>
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
            <ImageIcon className="h-5 w-5 text-gray-500" />
            About Us Editor ({selectedCountry})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. About OECL Logistics"
                  />
                </div>
                <div>
                  <Label htmlFor="image">Banner/Team Image</Label>
                  <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>
              
              <div>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-md border" />
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded-md border flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="h-8 w-8 mb-2" />
                    <span className="text-sm">No image uploaded</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mission">Our Mission</Label>
                <Textarea
                  id="mission"
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  rows={4}
                  placeholder="Enter company mission..."
                />
              </div>
              <div>
                <Label htmlFor="vision">Our Vision</Label>
                <Textarea
                  id="vision"
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  rows={4}
                  placeholder="Enter company vision..."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="content">Main Content</Label>
              
              {/* Rich Text Toolbar */}
              <div className="border rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1 mb-0 mt-2">
                <Button type="button" variant="ghost" size="sm" onClick={handleBold} className="h-8 w-8 p-0" title="Bold (**text**)">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={handleItalic} className="h-8 w-8 p-0" title="Italic (*text*)">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={handleUnderline} className="h-8 w-8 p-0" title="Underline (<u>text</u>)">
                  <Underline className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button type="button" variant="ghost" size="sm" onClick={handleLink} className="h-8 w-8 p-0" title="Add Link">
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button type="button" variant="ghost" size="sm" onClick={handleBulletList} className="h-8 w-8 p-0" title="Bullet List">
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Textarea
                ref={contentRef}
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="rounded-t-none border-t-0"
                placeholder="Enter the main content for the About Us page..."
              />
              <div className="text-xs text-gray-500 mt-2">
                <strong>Formatting help:</strong> **bold**, *italic*, &lt;u&gt;underline&lt;/u&gt;, link text, - bullet list
              </div>
            </div>
            
            <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>

        {/* Link Dialog */}
        {showLinkDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-white">
              <CardHeader>
                <CardTitle>Add Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="link-text">Link Text</Label>
                  <Input
                    id="link-text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Text to display"
                  />
                </div>
                <div>
                  <Label htmlFor="link-url">URL *</Label>
                  <Input
                    id="link-url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowLinkDialog(false)}>Cancel</Button>
                  <Button type="button" onClick={insertLink}>Insert Link</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
}