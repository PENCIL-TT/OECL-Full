import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, Building2, CheckCircle2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentCountryFromPath } from "@/services/countryDetection";

const ContactForm = () => {
  const location = useLocation();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [indiaPage, setIndiaPage] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [recipientEmails, setRecipientEmails] = useState(["logistics.jkt@oecl.sg", "oecldm@gmail.com"]);
  const formRef = useRef(null);

 const getCurrentCountry = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes("/india")) return "India";
    if (path.includes("/malaysia")) return "Malaysia";
    if (path.includes("/indonesia")) return "Indonesia";
    if (path.includes("/thailand")) return "Thailand";
    return "Singapore";
  };

  const currentCountry = getCurrentCountry();
  const detected = getCurrentCountryFromPath(location.pathname);
  const countryName = detected?.code === "SG" ? "singapore" : (detected?.name?.toLowerCase() || "singapore");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data: pageData } = await supabase.from('contact_page_content').select('*').eq('country', countryName).maybeSingle();
        if (pageData) {
          setPageContent({ title: pageData.title || "Get In Touch", subtitle: pageData.subtitle || "Ready to streamline your logistics? Contact us today for a customized solution." });
          if (pageData.recipient_emails?.length > 0) setRecipientEmails(pageData.recipient_emails);
        } else {
          const { data: sgData } = await supabase.from('contact_page_content').select('*').eq('country', 'singapore').maybeSingle();
          if (sgData) {
            setPageContent({ title: sgData.title || "Get In Touch", subtitle: sgData.subtitle || "Ready to streamline your logistics? Contact us today for a customized solution." });
            if (sgData.recipient_emails?.length > 0) setRecipientEmails(sgData.recipient_emails);
          }
        }
        
        const { data: formSet } = await supabase.from('contact_form_settings').select('*').eq('country', countryName).maybeSingle();
        if (formSet) {
          setFormSettings({
            form_title: formSet.form_title || "Send us a Message", form_subtitle: formSet.form_subtitle || "Fill out the form below and we'll get back to you within 24 hours.",
            button_text: formSet.button_text || "Send Message", success_message: formSet.success_message || "Your message has been sent successfully. We'll get back to you soon!"
          });
        } else {
          const { data: sgFormSet } = await supabase.from('contact_form_settings').select('*').eq('country', 'singapore').maybeSingle();
          if (sgFormSet) setFormSettings({
            form_title: sgFormSet.form_title || "Send us a Message", form_subtitle: sgFormSet.form_subtitle || "Fill out the form below and we'll get back to you within 24 hours.",
            button_text: sgFormSet.button_text || "Send Message", success_message: sgFormSet.success_message || "Your message has been sent successfully. We'll get back to you soon!"
          });
        }
      } catch (error) {
        console.error("Error fetching contact content:", error);
      }
    };
    fetchContent();
  }, [countryName]);

  useEffect(() => {
    setSelectedLocation(currentCountry);
  }, [currentCountry]);

  useEffect(() => {
    if (currentCountry === "India") {
      const interval = setInterval(() => {
        setIndiaPage((prev) => (prev === 0 ? 1 : 0));
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [currentCountry]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const emails = recipientEmails;
    try {
      for (const email of emails) {
        await fetch(`https://formsubmit.co/ajax/${email}`, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        });
      }

      form.reset();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };


  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white" id="contact">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Get In Touch</h2>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{pageContent.title}</h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-4" />
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Ready to streamline your logistics? Contact us today for a customized solution.
            {pageContent.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Office List */}

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">{formSettings.form_title}</h3>
            <p className="text-gray-600 mb-6">
              {formSettings.form_subtitle}
            </p>

            <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="box" />
              <input type="hidden" name="_subject" value={`New Contact Submission from ${selectedLocation}`} />
              <input type="hidden" name="Preferred_Location" value={selectedLocation} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name *</label>
                  <Input placeholder="Enter your first name" name="First Name" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name *</label>
                  <Input placeholder="Enter your last name" name="Last Name" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address *</label>
                  <Input type="email" name="Email" placeholder="Enter your email" required />
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

              <div className="space-y-2 max-w-md mx-auto p-4 bg-white rounded-lg shadow">
                <label className="text-sm font-medium text-gray-700">Preferred Office Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select office location" />
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message *</label>
                <Textarea name="Message" placeholder="Tell us about your logistics needs..." required rows={5} />
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {formSettings.button_text}
                </Button>
              </motion.div>

              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 p-4 rounded-xl bg-green-100 border border-green-400 text-green-800 shadow flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="text-sm md:text-base font-medium">
                    {formSettings.success_message}
                  </p>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
