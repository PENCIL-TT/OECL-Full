import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, X, Bold, Link, Italic, Underline, List } from "lucide-react";

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featured_image?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
  alt_text?: string;
  tags?: string[];
}

const BlogEditor = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Blog form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [slug, setSlug] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [altText, setAltText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Link dialog state
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!editingId) {
      const generatedSlug = generateSlug(value);
      setSlug(generatedSlug);
      
      if (!metaTitle) {
        setMetaTitle(value);
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      if (!altText && title) {
        setAltText(title);
      }
    }
  };

  // Rich text formatting functions
  const insertTextAtCursor = (beforeText: string, afterText: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    const newText = beforeText + selectedText + afterText;
    const newContent = content.substring(0, start) + newText + content.substring(end);
    
    setContent(newContent);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + beforeText.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleBold = () => {
    insertTextAtCursor('**', '**');
  };

  const handleItalic = () => {
    insertTextAtCursor('*', '*');
  };

  const handleUnderline = () => {
    insertTextAtCursor('<u>', '</u>');
  };

  const handleLink = () => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    setLinkText(selectedText);
    setShowLinkDialog(true);
  };

  const insertLink = () => {
    if (!linkUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a URL",
      });
      return;
    }

    const displayText = linkText || linkUrl;
    const linkMarkdown = `[${displayText}](${linkUrl})`;
    
    const textarea = contentRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + linkMarkdown + content.substring(end);
      setContent(newContent);
      
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + linkMarkdown.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }

    setShowLinkDialog(false);
    setLinkUrl('');
    setLinkText('');
  };

  const handleBulletList = () => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = content.substring(0, start).split('\n');
    const currentLineStart = lines.length > 1 ? 
      content.substring(0, start).lastIndexOf('\n') + 1 : 0;
    
    insertTextAtCursor('\n- ');
  };

  const handleNumberedList = () => {
    const textarea = contentRef.current;
    if (!textarea) return;

    insertTextAtCursor('\n1. ');
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery-singapore')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('gallery-singapore')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !excerpt || !slug) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    setLoading(true);
    try {
      let featuredImage = null;
      
      if (selectedFile) {
        featuredImage = await uploadImage(selectedFile);
      }

      const articleData = {
        title,
        content,
        excerpt,
        slug,
        featured_image: featuredImage,
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt,
        alt_text: altText || title,
        tags: tags.length > 0 ? tags : null,
        published_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Article updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([articleData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Article created successfully",
        });
      }

      resetForm();
      fetchArticles();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: Article) => {
    setTitle(article.title);
    setContent(article.content);
    setExcerpt(article.excerpt);
    setSlug(article.slug);
    setMetaTitle(article.meta_title || '');
    setMetaDescription(article.meta_description || '');
    setAltText(article.alt_text || '');
    setTags(article.tags || []);
    setEditingId(article.id);
    if (article.featured_image) {
      setImagePreview(article.featured_image);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
      
      fetchArticles();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setExcerpt('');
    setSlug('');
    setMetaTitle('');
    setMetaDescription('');
    setAltText('');
    setTags([]);
    setTagInput('');
    setSelectedFile(null);
    setImagePreview(null);
    setEditingId(null);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Article' : 'Create New Article'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated-from-title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="meta-title">SEO Meta Title</Label>
                <Input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Leave empty to use main title"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">{metaTitle.length}/60 characters</p>
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="meta-description">SEO Meta Description</Label>
              <Textarea
                id="meta-description"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Leave empty to use excerpt"
                rows={2}
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">{metaDescription.length}/160 characters</p>
            </div>

            <div>
              <Label htmlFor="tags">Tags/Hashtags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  placeholder="Add tags (press Enter or click Add)"
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              
              {/* Rich Text Toolbar */}
              <div className="border rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1 mb-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleBold}
                  className="h-8 w-8 p-0"
                  title="Bold (**text**)"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleItalic}
                  className="h-8 w-8 p-0"
                  title="Italic (*text*)"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleUnderline}
                  className="h-8 w-8 p-0"
                  title="Underline (<u>text</u>)"
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleLink}
                  className="h-8 w-8 p-0"
                  title="Add Link"
                >
                  <Link className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleBulletList}
                  className="h-8 w-8 p-0"
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleNumberedList}
                  className="h-8 w-8 p-0"
                  title="Numbered List"
                >
                  <span className="text-xs font-bold">1.</span>
                </Button>
              </div>

              <Textarea
                ref={contentRef}
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                required
                className="rounded-t-none border-t-0"
                placeholder="Write your article content here. Use the toolbar above for formatting:
- **bold text**
- *italic text*
- <u>underlined text</u>
- [link text](https://example.com)
- Bullet lists and numbered lists"
              />
              
              <div className="text-xs text-gray-500 mt-2">
                <strong>Formatting help:</strong> **bold**, *italic*, <u>underline</u>, [link text](URL), - bullet list, 1. numbered list
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image">Featured Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="alt-text">Image Alt Text</Label>
                <Input
                  id="alt-text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Descriptive text for accessibility"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Article' : 'Create Article'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowLinkDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={insertLink}>Insert Link</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Published Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <h3 className="font-medium">{article.title}</h3>
                  <p className="text-sm text-gray-600">{article.excerpt}</p>
                  <div className="flex gap-4 text-xs text-gray-400 mt-1">
                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                    <span>Slug: /{article.slug}</span>
                    {article.meta_title && <span>SEO: ✓</span>}
                    {article.tags && article.tags.length > 0 && (
                      <span>Tags: {article.tags.length}</span>
                    )}
                  </div>
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{article.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(article)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(article.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogEditor;
