import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, RefreshCw, Mail } from 'lucide-react';

const ContactPageEditor = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    recipient_emails: [] as string[],
    indonesia_recipient_emails: [] as string[],
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_page_content')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          recipient_emails: data.recipient_emails || [],
          indonesia_recipient_emails: data.indonesia_recipient_emails || [],
        });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error loading content", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('contact_page_content')
        .upsert({ id: 1, ...formData, updated_at: new Date().toISOString() });

      if (error) throw error;
      toast({ title: "Success", description: "Contact page content updated." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-red-600" />
          Contact Page Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="font-semibold">Page Title</label>
          <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Get In Touch" />
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Page Subtitle</label>
          <Textarea value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} rows={3} placeholder="e.g., We're here to help..." />
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Default Recipient Emails</label>
          <p className="text-sm text-gray-500">Enter emails separated by commas. These will receive form submissions from most pages.</p>
          <Input value={formData.recipient_emails.join(', ')} onChange={(e) => setFormData({ ...formData, recipient_emails: e.target.value.split(',').map(email => email.trim()) })} placeholder="email1@example.com, email2@example.com" />
        </div>
        <div className="space-y-2">
          <label className="font-semibold">Indonesia Recipient Emails</label>
          <p className="text-sm text-gray-500">Specific emails for the Indonesia contact form.</p>
          <Input value={formData.indonesia_recipient_emails.join(', ')} onChange={(e) => setFormData({ ...formData, indonesia_recipient_emails: e.target.value.split(',').map(email => email.trim()) })} placeholder="email1@example.com, email2@example.com" />
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</span> : <span className="flex items-center"><Save className="w-4 h-4 mr-2" /> Save Changes</span>}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ContactPageEditor;