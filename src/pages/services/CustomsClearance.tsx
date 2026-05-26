import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import * as Icons from "lucide-react";
import { UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CustomsClearance = () => {
  const [dbData, setDbData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('service_page_content').select('*').eq('slug', 'customs-clearance').maybeSingle();
        if (data) setDbData(data);
      } catch (err) {
        console.error("Error fetching customs clearance content:", err);
      }
    };
    fetchData();
  }, []);
  return <div className="bg-white text-black min-h-screen">
      <Navigation />
       <SEO
        title="B2B Customs Clearance Services in Singapore | OECL Logistics"
        description="OECL offers expert customs clearance solutions for businesses in Singapore, ensuring seamless import and export compliance, accurate documentation, and efficient handling of trade procedures."
        keywords="B2B customs clearance Singapore, business import/export services, trade compliance logistics, OECL customs solutions, Singapore customs brokers, commercial customs clearance, logistics documentation support, B2B logistics Singapore"
        url="https://www.oecl.sg/services/customs-clearance"
      />
      
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-red-600/20 px-6 py-3 rounded-full mb-6">
              <UserCheck className="w-6 h-6 text-red-500" />
              <span className="text-red-500 font-semibold">Customs Clearance</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Customs <span className="text-red-500">Clearance</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Expert customs brokerage services ensuring smooth and compliant cargo clearance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            delay: 0.2
          }} className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img src="/customclearance.png" alt="Customs Clearance Services" className="w-full h-96 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            delay: 0.4
          }} className="space-y-6">
              <h2 className="text-3xl font-bold text-red-500">{dbData?.content_title || "Customs Clearance"}</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {dbData?.content_p1 || "As one of the leading custom clearing agents, we ensure that all clearance formalities are done in a smooth and easy manner so that all our customers receive their goods on time. Our customs brokers help ease import and export regulations and all paperwork related to trade compliances and procedures to ensure that your consignments via sea and air leave on time."}
              </p>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {dbData?.content_p2 || "OECL takes pride in being in business for more than a decade and have cleared all types of shipments of any sizes and for a plethora of goods from across the world taking care of each transportation with precision. It is our well-experienced team that makes us the best and leading customs clearing agents as our professionals carry out a complete study of all the local rules and regulations to help our clients overcome the complex matters of trade compliances."}
              </p>
              
              <p className="text-gray-700 text-lg leading-relaxed">
                {dbData?.content_p3 || "It is our ability in identifying demand and changing challenges in business that makes us the best to help you take care of all your paper works thereby ensuring the smooth flow of your business operations. With all the required documents in place, our professionals also ensure end-to-end solutions for both Import and Export Customs Clearance."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4">Why Choose Our Customs Service</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: dbData?.benefit_1_icon || "FileText",
                title: dbData?.benefit_1_title || "Expert Documentation",
                description: dbData?.benefit_1_desc || "Comprehensive handling of all import/export documentation requirements"
              },
              {
                icon: dbData?.benefit_2_icon || "Shield",
                title: dbData?.benefit_2_title || "Compliance Assurance",
                description: dbData?.benefit_2_desc || "Ensuring full regulatory compliance across all jurisdictions"
              },
              {
                icon: dbData?.benefit_3_icon || "Globe",
                title: dbData?.benefit_3_title || "Global Experience",
                description: dbData?.benefit_3_desc || "Extensive knowledge of international customs procedures and regulations"
              }
            ].map((benefit, index) => {
              const BenefitIcon = (Icons as any)[benefit.icon] || Icons.CheckCircle;
              return (
              <motion.div key={index} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2 * index
          }} viewport={{
            once: true
          }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="bg-red-600/20 p-4 rounded-xl mb-6 w-fit">
                  <BenefitIcon className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            )})}
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default CustomsClearance;
