import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Loader2, PlusCircle, RefreshCcw, Save, Search, Trash2 } from "lucide-react";

const createDefaultFormState = () => ({
  id: "",
  page_slug: "",
  meta_title: "",
  meta_description: "",
  keywords: "",
  og_title: "",
  og_description: "",
  og_image: "",
});

type PageSEO = Database["public"]["Tables"]["page_seo"]["Row"];
type FormState = ReturnType<typeof createDefaultFormState>;

const SeoEditor: React.FC = () => {
  const [entries, setEntries] = useState<PageSEO[]>([]);
  const [formState, setFormState] = useState<FormState>(() => createDefaultFormState());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("page_seo")
        .select("*")
        .order("page_slug", { ascending: true });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      console.error("Error fetching SEO entries", error.message);
      toast({
        variant: "destructive",
        title: "Failed to load SEO entries",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const filteredEntries = useMemo(() => {
    if (!searchTerm) return entries;
    const term = searchTerm.toLowerCase();
    return entries.filter((entry) =>
      entry.page_slug.toLowerCase().includes(term) ||
      (entry.meta_title?.toLowerCase() || "").includes(term)
    );
  }, [entries, searchTerm]);

  const handleSelectEntry = (entry: PageSEO) => {
    setFormState({
      id: entry.id,
      page_slug: entry.page_slug,
      meta_title: entry.meta_title || "",
      meta_description: entry.meta_description || "",
      keywords: entry.keywords?.join(", ") || "",
      og_title: entry.og_title || "",
      og_description: entry.og_description || "",
      og_image: entry.og_image || "",
    });
  };

  const resetForm = () => {
    setFormState(createDefaultFormState());
  };

  const handleInputChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSave = async () => {
    if (!formState.page_slug) {
      toast({
        variant: "destructive",
        title: "Page slug is required",
        description: "Please provide a unique identifier for the page, e.g. /about-us",
      });
      return;
    }

    setIsSaving(true);
    try {
      const keywordsArray = formState.keywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

      const payload = {
        id: formState.id || undefined,
        page_slug: formState.page_slug.trim(),
        meta_title: formState.meta_title.trim() || null,
        meta_description: formState.meta_description.trim() || null,
        keywords: keywordsArray.length ? keywordsArray : null,
        og_title: formState.og_title.trim() || null,
        og_description: formState.og_description.trim() || null,
        og_image: formState.og_image.trim() || null,
      } satisfies Database["public"]["Tables"]["page_seo"]["Insert"];

      const { error } = await supabase
        .from("page_seo")
        .upsert(payload, { onConflict: "page_slug" });

      if (error) throw error;

      toast({
        title: "SEO metadata saved",
        description: `Metadata for ${payload.page_slug} has been updated`,
      });

      resetForm();
      await fetchEntries();
    } catch (error: any) {
      console.error("Error saving SEO metadata", error.message);
      toast({
        variant: "destructive",
        title: "Failed to save metadata",
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!formState.id) {
      toast({
        variant: "destructive",
        title: "Select an entry first",
        description: "Choose a page from the list before deleting",
      });
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this SEO configuration?");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("page_seo")
        .delete()
        .eq("id", formState.id);

      if (error) throw error;

      toast({
        title: "SEO metadata removed",
        description: `${formState.page_slug} has been cleared from SEO table`,
      });

      resetForm();
      await fetchEntries();
    } catch (error: any) {
      console.error("Error deleting SEO metadata", error.message);
      toast({
        variant: "destructive",
        title: "Failed to delete",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">SEO Editor</h1>
        <p className="text-muted-foreground">
          Manage page level SEO metadata centrally for the entire site.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>Pages</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={fetchEntries} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={resetForm}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Select a page to edit its SEO metadata.</p>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by slug or title"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[480px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead className="hidden lg:table-cell">Title</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-sm text-muted-foreground">
                        {isLoading ? "Loading pages..." : "No SEO entries yet"}
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredEntries.map((entry) => (
                    <TableRow
                      key={entry.id}
                      className={cn(
                        "cursor-pointer hover:bg-muted/50",
                        formState.id === entry.id && "bg-muted"
                      )}
                      onClick={() => handleSelectEntry(entry)}
                    >
                      <TableCell className="font-medium">{entry.page_slug}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {entry.meta_title || <span className="text-muted-foreground">No title</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{formState.id ? "Edit SEO Metadata" : "Create SEO Metadata"}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Define the page slug exactly as it appears in the browser path. Use forward slash notation (e.g. "/services").
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="page-slug">Page Slug</Label>
                <Input
                  id="page-slug"
                  placeholder="/about-us"
                  value={formState.page_slug}
                  onChange={handleInputChange("page_slug")}
                />
              </div>
              <div>
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  placeholder="Title shown in browser tab"
                  value={formState.meta_title}
                  onChange={handleInputChange("meta_title")}
                />
              </div>
              <div>
                <Label htmlFor="og-title">OpenGraph Title</Label>
                <Input
                  id="og-title"
                  placeholder="Social sharing title"
                  value={formState.og_title}
                  onChange={handleInputChange("og_title")}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  rows={4}
                  placeholder="Short description used by search engines"
                  value={formState.meta_description}
                  onChange={handleInputChange("meta_description")}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="og-description">OpenGraph Description</Label>
                <Textarea
                  id="og-description"
                  rows={3}
                  placeholder="Description used when sharing on social platforms"
                  value={formState.og_description}
                  onChange={handleInputChange("og_description")}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  placeholder="logistics, freight, shipping"
                  value={formState.keywords}
                  onChange={handleInputChange("keywords")}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Separate keywords with commas. Optional.
                </p>
              </div>
              <div>
                <Label htmlFor="og-image">OpenGraph Image URL</Label>
                <Input
                  id="og-image"
                  placeholder="https://example.com/image.png"
                  value={formState.og_image}
                  onChange={handleInputChange("og_image")}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Provide a full URL to the image used when the page is shared.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="mr-2 h-4 w-4" /> Save Metadata
                  </span>
                )}
              </Button>
              <Button variant="outline" onClick={resetForm} disabled={isSaving}>
                Reset
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={!formState.id || isSaving}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeoEditor;
