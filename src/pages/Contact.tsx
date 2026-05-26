import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LocationsSection from "@/components/LocationsSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Send, XCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentCountryFromPath } from "@/services/countryDetection";

const Contact: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [pageContent, setPageContent] = useState({ title: "Get in Touch", subtitle: "We're here to help and answer any questions you might have." });
  const [formSettings, setFormSettings] = useState({
    form_title: "Send us a Message",
    form_subtitle: "Fill in the form below and we'll get back to you as soon as possible.",
    button_text: "Send Message",
    success_message: "Message sent successfully!"
  });
  const [recipientEmails, setRecipientEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const detected = getCurrentCountryFromPath(location.pathname);
  const countryName = detected?.code === "SG" ? "singapore" : (detected?.name?.toLowerCase() || "singapore");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchContent = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.from('contact_page_content').select('*').eq('country', countryName).maybeSingle();
        if (data) {
          setPageContent({ title: data.title || "Get in Touch", subtitle: data.subtitle || "We're here to help and answer any questions you might have." });
          if (data.recipient_emails?.length > 0) setRecipientEmails(data.recipient_emails);
        } else {
          const { data: sgData } = await supabase.from('contact_page_content').select('*').eq('country', 'singapore').maybeSingle();
          if (sgData) {
            setPageContent({ title: sgData.title || "Get in Touch", subtitle: sgData.subtitle || "We're here to help and answer any questions you might have." });
            if (sgData.recipient_emails?.length > 0) setRecipientEmails(sgData.recipient_emails);
          }
        }
        
        const { data: formSet } = await supabase.from('contact_form_settings').select('*').eq('country', countryName).maybeSingle();
        if (formSet) {
          setFormSettings({
            form_title: formSet.form_title || "Send us a Message", form_subtitle: formSet.form_subtitle || "Fill in the form below and we'll get back to you as soon as possible.",
            button_text: formSet.button_text || "Send Message", success_message: formSet.success_message || "Message sent successfully!"
          });
        } else {
          const { data: sgFormSet } = await supabase.from('contact_form_settings').select('*').eq('country', 'singapore').maybeSingle();
          if (sgFormSet) setFormSettings({
            form_title: sgFormSet.form_title || "Send us a Message", form_subtitle: sgFormSet.form_subtitle || "Fill in the form below and we'll get back to you as soon as possible.",
            button_text: sgFormSet.button_text || "Send Message", success_message: sgFormSet.success_message || "Message sent successfully!"
          });
        }
      } catch (error) {
        console.error("Error fetching contact content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [countryName]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const urls = recipientEmails.map(email => `https://formsubmit.co/ajax/${email}`);
    try {
      const results = await Promise.all(
        urls.map(url =>
          fetch(url, {
            method: "POST",
            body: formData
          })
        )
      );

      const allSuccessful = results.every(res => res.ok);

      if (allSuccessful) {
        setShowNotification(true);
        form.reset();
        setSelectedLocation("");
        setTimeout(() => setShowNotification(false), 4000);
      } else {
        alert("One or more submissions failed. Please try again.");
      }
    } catch (err) {
      alert("Submission failed. Please check your connection and try again.");
      console.error(err);
    }
  };


  return (
    <div className="min-h-screen flex flex-col relative">
      <Navigation />

      <main className="flex-grow">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[40vh] flex items-center justify-center bg-red-700 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black to-red-900/90" />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center px-4 relative z-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">{pageContent.title}</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto font-light">
              {pageContent.subtitle}
            </p>
          </motion.div>
        </motion.section>

        <section className="py-16 bg-gradient-to-b from-red-50/30 to-white">
          <div className="container mx-auto px-4">
            <LocationsSection />
          </div>
        </section>

        <section className="py-16 bg-white" id="contact-form">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
              > {loading ? (
                  <div className="flex justify-center items-center h-96"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold mb-2 text-black text-center">{formSettings.form_title}</h2>
                    <div className="w-16 h-1 bg-red-600 mx-auto mb-6"></div>
                    <p className="text-gray-600 mb-8 text-center">{formSettings.form_subtitle}</p>
                  </>
                )}

                {showNotification && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Send size={18} />
                      <span>{formSettings.success_message}</span>
                    </div>
                    <button onClick={() => setShowNotification(false)} className="text-green-800">
                      <XCircle size={18} />
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="box" />
                  <input type="hidden" name="_subject" value="New Contact Form Submission" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">First Name *</label>
                      <Input name="First Name" required placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Last Name *</label>
                      <Input name="Last Name" required placeholder="Enter your last name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address *</label>
                      <Input name="Email" required type="email" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <Input name="Phone" placeholder="Enter your phone number" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Company/Organization</label>
                    <Input name="Organization" placeholder="Enter your company name" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Preferred Location *</label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred office location" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Singapore (HQ)", "Malaysia", "India", "Thailand", "Indonesia",
                          "Sri Lanka", "Myanmar", "Pakistan", "Bangladesh", "UK", "USA"
                        ].map((loc) => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="Preferred Location" value={selectedLocation} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Message *</label>
                    <Textarea
                      name="Message"
                      required
                      placeholder="Tell us about your logistics needs..."
                      rows={5}
                    />
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <Send className="w-5 h-5" />
                      {formSettings.button_text}
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
