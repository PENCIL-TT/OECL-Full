import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, RefreshCw, LayoutTemplate } from 'lucide-react';

const defaultContentMap: Record<string, any> = {
  'air-freight': {
    content_title: "Why Choose Our Air Freight?",
    content_p1: "As one of the leading independent airfreight company, we provide more flexibility, choice worldwide by working in partnership with an extensive range of specialist carriers who provide customized schedules and solutions. Our Directors and Managers are hands-on and work closely with our staff to provide an integrated highly professional service to our clients.",
    content_p2: "The company through its extensive worldwide network have established a fast and efficient airfreight product which translates into a cost-efficient and fast movement of cargo to and from worldwide markets.",
    content_p3: "OECL can provide customized sea-air & air-sea options to meet customer’s deadline/timeliness and achieve cost savings. The company handles the airfreight consolidation on many major routes through its efficient worldwide network",
    benefits_title: "Our Service Benefits",
    benefit_1_icon: "Clock", benefit_1_title: "Speed & Efficiency", benefit_1_desc: "Fastest transit times with priority handling for urgent shipments",
    benefit_2_icon: "Globe", benefit_2_title: "Global Network", benefit_2_desc: "Worldwide coverage with reliable airline partnerships",
    benefit_3_icon: "Shield", benefit_3_title: "Secure & Insured", benefit_3_desc: "Full cargo insurance and secure handling protocols",
  },
  'ocean-freight': {
    content_title: "Comprehensive Ocean Freight",
    content_p1: "OECL has own fleet of containers including special equipment's to accommodate special requirements of customers and specializes in many trade lanes. Being sea freight professionals with vast experience in the field helps to match frequent sailing and flexible service options.",
    content_p2: "Multiple carrier options on any trade route with contracted rates helps to secure the space, allocation, timing, pricing and frequency of your shipments.",
    content_p3: "",
    benefits_title: "Our Service Benefits",
    benefit_1_icon: "Clock", benefit_1_title: "FCL Services", benefit_1_desc: "FCL is the most optimized container shipping way regarding cost, volume and weight of the cargo.\nWe take special care at each step of the process which involves fixing contract pricing with carriers, reserving space, make booking, picking up empty container at the container depot,\nloading at shipper facility, transporting by truck / rail to the port and vessel loading, monitor vessel schedule till final delivery to consignee.\n\nFor import bookings we engage our overseas partners in the absence of our own network and monitor each step and keep our customers / consignees informed at all stages.",
    benefit_2_icon: "Globe", benefit_2_title: "LCL Services", benefit_2_desc: "OECL operate own consolidation service on many trade routes.\nWith its vast network of consolidators, the company is able to provide competitive price with multiple options of sailing.\nWith regular consolidation boxes to important trade lanes, the company has the advantage of accommodating cargo which requires timely deliveries.",
    benefit_3_icon: "", benefit_3_title: "", benefit_3_desc: "",
  },
  'warehousing': {
    content_title: "Warehousing",
    content_p1: "Warehouse management is a key part of the supply chain and primarily aims to control the movement and storage of materials within a warehouse and process the associated transactions including shipping, receiving, put away and picking. With visibility in to processes that proceed and follow the supply chain link, your warehouse will become an accelerator and not a road block to drive greater profitability and customer satisfaction.",
    content_p2: "The objective of WM is to handle the receipts of stock and manage supplies. WM today is part of supply chain management and also demand management. It also covers the container storage, loading and unloading.",
    content_p3: "An efficient WM gives a cutting edge to retail chain distribution. The company identifies the customer needs and assist to handle in the best possible manner. The company has expertise in handling vanning and devanning of consolidation cargo and arranges to distribute/deliver to respective parties from the warehouse which delivers full satisfaction to its customers.",
    benefits_title: "Warehouse Features",
    benefit_1_icon: "Database", benefit_1_title: "Advanced WMS", benefit_1_desc: "Sophisticated warehouse management system for optimal efficiency",
    benefit_2_icon: "Package", benefit_2_title: "Flexible Storage", benefit_2_desc: "Various storage options including temperature-controlled environments",
    benefit_3_icon: "BarChart3", benefit_3_title: "Real-time Analytics", benefit_3_desc: "Live inventory tracking and comprehensive reporting dashboard",
  },
  'customs-clearance': {
    content_title: "Customs Clearance",
    content_p1: "As one of the leading custom clearing agents, we ensure that all clearance formalities are done in a smooth and easy manner so that all our customers receive their goods on time. Our customs brokers help ease import and export regulations and all paperwork related to trade compliances and procedures to ensure that your consignments via sea and air leave on time.",
    content_p2: "OECL takes pride in being in business for more than a decade and have cleared all types of shipments of any sizes and for a plethora of goods from across the world taking care of each transportation with precision. It is our well-experienced team that makes us the best and leading customs clearing agents as our professionals carry out a complete study of all the local rules and regulations to help our clients overcome the complex matters of trade compliances.",
    content_p3: "It is our ability in identifying demand and changing challenges in business that makes us the best to help you take care of all your paper works thereby ensuring the smooth flow of your business operations. With all the required documents in place, our professionals also ensure end-to-end solutions for both Import and Export Customs Clearance.",
    benefits_title: "Why Choose Our Customs Service",
    benefit_1_icon: "FileText", benefit_1_title: "Expert Documentation", benefit_1_desc: "Comprehensive handling of all import/export documentation requirements",
    benefit_2_icon: "Shield", benefit_2_title: "Compliance Assurance", benefit_2_desc: "Ensuring full regulatory compliance across all jurisdictions",
    benefit_3_icon: "Globe", benefit_3_title: "Global Experience", benefit_3_desc: "Extensive knowledge of international customs procedures and regulations",
  },
  'liner-agency': {
    content_title: "Liner Agency",
    content_p1: "OECL has liner division which is representing many medium to small carriers who use our local knowledge and expertise to handle and market their products. We provide first class liner and port agency services, together with an extensive range of related services to liners who trust our company knowing the potential and people in the management and their experience.",
    content_p2: "Highly dedicated, enthusiastic and professional employees, providing top quality service, have swiftly turned Overseas Express Container Lines into a well-established agency, with a remarkable reputation in all aspects. With dedicated trained personnel for each principals OECL ensures equal attention and care in order to protect every principal's interest.",
    content_p3: "With shipping industry going through many changes, OECL helps shipping carriers to optimize their resources by providing local support to ensure a win-win formula. We provide full range of general agency to various elements of shipping support and our services are tailored to meet the exact needs of principals in this fast changing global liner shipping environment.",
    benefits_title: "Our Agency Services",
    benefit_1_icon: "Network", benefit_1_title: "Line Representation", benefit_1_desc: "Professional representation of major shipping lines in regional ports",
    benefit_2_icon: "Anchor", benefit_2_title: "Port Operations", benefit_2_desc: "Complete port agency services including vessel clearance and support",
    benefit_3_icon: "Calendar", benefit_3_title: "Schedule Management", benefit_3_desc: "Efficient vessel scheduling and booking coordination services",
  },
  'liquid-cargo': {
    content_title: "Liquid Cargo Transportation",
    content_p1: "OECL provides expertise and services for carriage of liquid cargoes in ISO Tanks, Flexi Tanks and IBCs (Inter Bulk Containers). OECL provide professional, cost effective and safe transportation of liquid cargo . A well experienced dedicated team provides complete logistics management for door to door movements with complete visibility.",
    content_p2: "", content_p3: "", benefits_title: "Features",
    benefit_1_icon: "Truck", benefit_1_title: "Specialized tank transportation", benefit_1_desc: "",
    benefit_2_icon: "Thermometer", benefit_2_title: "Temperature-controlled transport", benefit_2_desc: "",
    benefit_3_icon: "Shield", benefit_3_title: "Hazardous material handling", benefit_3_desc: "",
  },
  'consolidation': {
    content_title: "Cargo Consolidation",
    content_p1: "OECL's cargo consolidation allows multiple shippers to share space and reduce freight costs, with end-to-end tracking and full transparency.",
    content_p2: "", content_p3: "", benefits_title: "Features",
    benefit_1_icon: "CheckCircle", benefit_1_title: "Cost Effective", benefit_1_desc: "",
    benefit_2_icon: "CheckCircle", benefit_2_title: "Tracking", benefit_2_desc: "",
    benefit_3_icon: "CheckCircle", benefit_3_title: "Transparency", benefit_3_desc: "",
  },
  'project-cargo': {
    content_title: "Project Cargo",
    content_p1: "We have a dedicated knowledge based project division having skilled experts in the field inherited from major project handlers. OECL are well equipped to handle all kinds of long lengths, over width, over height, heavy lift and complex project cargoes including those that needs floating cranes or tandem lifting.",
    content_p2: "We create single solution packages, tailor made to meet our customers specific shipping and transport requirements, to most compass points across the globe, be it port to port or ex-works to door. Our project/heavy-lift breakbulk handling team guides our customers with the right strategy, after doing the feasibility and risk assessment study for every specific jobs.",
    content_p3: "Over to this we also provide our customers the knowledge, efficiency and safety, along with the timely communications they need.",
    benefits_title: "Warehouse Features",
    benefit_1_icon: "Database", benefit_1_title: "Advanced WMS", benefit_1_desc: "Sophisticated warehouse management system for optimal efficiency",
    benefit_2_icon: "Package", benefit_2_title: "Flexible Storage", benefit_2_desc: "Various storage options including temperature-controlled environments",
    benefit_3_icon: "BarChart3", benefit_3_title: "Real-time Analytics", benefit_3_desc: "Live inventory tracking and comprehensive reporting dashboard",
  },
  '3pl': {
    content_title: "Third-Party Logistics (3PL)",
    content_p1: "OECL offers 3PL services tailored to your supply chain. We manage storage, fulfillment, transportation, and reverse logistics so you can focus on your core business.",
    content_p2: "", content_p3: "", benefits_title: "Features",
    benefit_1_icon: "CheckCircle", benefit_1_title: "Storage", benefit_1_desc: "",
    benefit_2_icon: "CheckCircle", benefit_2_title: "Fulfillment", benefit_2_desc: "",
    benefit_3_icon: "CheckCircle", benefit_3_title: "Transportation", benefit_3_desc: "",
  }
};

const ServicePagesEditor = ({ activeSlug = "air-freight" }: { activeSlug?: string }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, [activeSlug]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('service_page_content').select('*').eq('slug', activeSlug).maybeSingle();
      if (error) throw error;

      if (data) {
        setFormData(data);
      } else {
        // Populate with the original text from our hardcoded map
        const defaultData = defaultContentMap[activeSlug] || {
          content_title: 'Why Choose Us?', content_p1: '', content_p2: '', content_p3: '', benefits_title: 'Our Service Benefits', benefit_1_icon: 'CheckCircle', benefit_1_title: 'Benefit 1', benefit_1_desc: '', benefit_2_icon: 'CheckCircle', benefit_2_title: 'Benefit 2', benefit_2_desc: '', benefit_3_icon: 'CheckCircle', benefit_3_title: 'Benefit 3', benefit_3_desc: ''
        };
        
        setFormData({ slug: activeSlug, ...defaultData });
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error fetching data', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData, updated_at: new Date().toISOString() };
      const { error } = await supabase.from('service_page_content').upsert(payload, { onConflict: 'slug' });
      if (error) throw error;

      toast({ title: "Success", description: "Service page updated successfully!" });
      fetchData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const formatLabel = (slug: string) => slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><LayoutTemplate className="w-6 h-6 text-red-600" /> Page Details Editor</h2>
          <p className="text-slate-500 text-sm mt-1">Manage the specific layout texts and images for {formatLabel(activeSlug)}.</p>
        </div>
        <Button onClick={handleSave} disabled={loading || saving} className="bg-red-600 hover:bg-red-700 text-white">{saving ? <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</span> : <span className="flex items-center"><Save className="w-4 h-4 mr-2" /> Publish Changes</span>}</Button>
      </div>

      {loading ? <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div> : (
        <form className="space-y-6">

          {/* Main Content Paragraphs */}
          <Card><CardHeader><CardTitle>Main Description</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="space-y-2"><Label>Section Title</Label><Input name="content_title" value={formData.content_title || ''} onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Paragraph 1</Label><Textarea name="content_p1" value={formData.content_p1 || ''} onChange={handleChange} rows={4} /></div>
            <div className="space-y-2"><Label>Paragraph 2</Label><Textarea name="content_p2" value={formData.content_p2 || ''} onChange={handleChange} rows={4} /></div>
            <div className="space-y-2"><Label>Paragraph 3</Label><Textarea name="content_p3" value={formData.content_p3 || ''} onChange={handleChange} rows={4} /></div>
          </CardContent></Card>

          {/* Benefits Section */}
          <Card><CardHeader><CardTitle>Service Benefits (3 Columns)</CardTitle></CardHeader><CardContent className="space-y-6">
            <div className="space-y-2"><Label>Benefits Section Title</Label><Input name="benefits_title" value={formData.benefits_title || ''} onChange={handleChange} /></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3 p-4 border rounded-xl bg-slate-50"><h4 className="font-bold text-red-600">Benefit 1</h4>
                <div className="space-y-1"><Label>Icon</Label><Input name="benefit_1_icon" value={formData.benefit_1_icon || ''} onChange={handleChange} /></div>
                <div className="space-y-1"><Label>Title</Label><Input name="benefit_1_title" value={formData.benefit_1_title || ''} onChange={handleChange} /></div>
                <div className="space-y-1"><Label>Description</Label><Textarea name="benefit_1_desc" value={formData.benefit_1_desc || ''} onChange={handleChange} rows={3} /></div>
              </div>
              <div className="space-y-3 p-4 border rounded-xl bg-slate-50"><h4 className="font-bold text-red-600">Benefit 2</h4>
                <div className="space-y-1"><Label>Icon</Label><Input name="benefit_2_icon" value={formData.benefit_2_icon || ''} onChange={handleChange} /></div>
                <div className="space-y-1"><Label>Title</Label><Input name="benefit_2_title" value={formData.benefit_2_title || ''} onChange={handleChange} /></div>
                <div className="space-y-1"><Label>Description</Label><Textarea name="benefit_2_desc" value={formData.benefit_2_desc || ''} onChange={handleChange} rows={3} /></div>
              </div>
              <div className="space-y-3 p-4 border rounded-xl bg-slate-50"><h4 className="font-bold text-red-600">Benefit 3</h4>
                <div className="space-y-1"><Label>Icon</Label><Input name="benefit_3_icon" value={formData.benefit_3_icon || ''} onChange={handleChange} /></div>
                <div className="space-y-1"><Label>Title</Label><Input name="benefit_3_title" value={formData.benefit_3_title || ''} onChange={handleChange} /></div>
                <div className="space-y-1"><Label>Description</Label><Textarea name="benefit_3_desc" value={formData.benefit_3_desc || ''} onChange={handleChange} rows={3} /></div>
              </div>
            </div>
          </CardContent></Card>
        </form>
      )}
    </div>
  );
};
export default ServicePagesEditor;