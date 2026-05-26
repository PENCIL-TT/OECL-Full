import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, FolderOpen, Save, X, RefreshCw } from "lucide-react";

interface ProjectData {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

const ProjectsEditor = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<ProjectData>>({
    title: '',
    category: '',
    image: '',
    description: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.image || !formData.category) {
      toast({ variant: "destructive", title: "Error", description: "Please fill in all required fields." });
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        image: formData.image,
      };

      if (formData.id) {
        const { error } = await supabase.from('projects').update(payload).eq('id', formData.id);
        if (error) throw error;
        toast({ title: "Success", description: "Project updated successfully" });
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
        toast({ title: "Success", description: "Project added successfully" });
      }

      resetForm();
      fetchProjects();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (project: ProjectData) => {
    setFormData(project);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Project deleted successfully" });
      fetchProjects();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const resetForm = () => {
    setFormData({ title: '', category: '', image: '', description: '' });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-red-600" /> Projects Editor
          </h2>
          <p className="text-slate-500 text-sm mt-1">Manage the case studies and projects displayed on your Projects page.</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="bg-red-600 hover:bg-red-700 text-white shadow-md">
            <Plus className="w-4 h-4 mr-2" /> Add Project
          </Button>
        )}
      </div>

      {isEditing && (
        <Card className="border-red-100 shadow-md">
          <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row justify-between items-center rounded-t-xl">
            <CardTitle>{formData.id ? "Edit Project" : "Add New Project"}</CardTitle>
            <Button variant="ghost" size="sm" onClick={resetForm}><X className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project Title *</Label>
                  <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Global E-commerce Supply Chain" required />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Input name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g. Supply Chain" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image URL or Path *</Label>
                <Input name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." required />
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} required />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white min-w-[140px] justify-center">
                  {isSaving ? (
                    <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</span>
                  ) : (
                    <span className="flex items-center"><Save className="w-4 h-4 mr-2" /> Save Project</span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 bg-slate-100 relative">
              {project.image && <img src={project.image} alt={project.title} className="w-full h-full object-cover" />}
            </div>
            <CardContent className="p-4">
              <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full mb-2 font-medium">
                {project.category}
              </span>
              <h3 className="font-bold text-lg mb-2 line-clamp-1">{project.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-3 mb-4">{project.description}</p>
              
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}><Edit className="w-4 h-4 text-blue-600" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default ProjectsEditor;