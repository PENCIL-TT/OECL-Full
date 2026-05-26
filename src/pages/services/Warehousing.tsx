import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import * as Icons from "lucide-react";
import { Box } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Warehousing = () => {
  const [dbData, setDbData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('service_page_content').select('*').eq('slug', 'warehousing').maybeSingle();
        if (data) setDbData(data);
      } catch (err) {
        console.error("Error fetching warehousing content:", err);
      }
    };
    fetchData();
  }, []);
  return <div className="bg-white text-black min-h-screen">
      <Navigation />
     <SEO
        title="Efficient B2B Warehousing Solutions | OECL Singapore Logistics Services"
        description="OECL offers tailored B2B warehousing solutions in Singapore, including inventory management, cold storage, container vanning, and distribution services to streamline your supply chain and boost business efficiency."
        keywords="B2B warehousing Singapore, business warehousing solutions, inventory management services, cold storage logistics, container vanning Singapore, supply chain warehousing, OECL warehousing, logistics for businesses, B2B logistics services, warehouse storage for companies"
        url="https://www.oecl.sg/services/warehousing"
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
              <Box className="w-6 h-6 text-red-500" />
              <span className="text-red-500 font-semibold">Warehousing Services</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Warehousing <span className="text-red-500">Solutions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">OECL is well equipped to handle the warehousing of various commodities including cold storage</p>
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
                <img src="/warehousing.png" alt="Warehousing Services" className="w-full h-96 object-cover" />
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
              <h2 className="text-3xl font-bold text-red-500">{dbData?.content_title || "Warehousing"}</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {dbData?.content_p1 || "Warehouse management is a key part of the supply chain and primarily aims to control the movement and storage of materials within a warehouse and process the associated transactions including shipping, receiving, put away and picking. With visibility in to processes that proceed and follow the supply chain link, your warehouse will become an accelerator and not a road block to drive greater profitability and customer satisfaction."}
              </p>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {dbData?.content_p2 || "The objective of WM is to handle the receipts of stock and manage supplies. WM today is part of supply chain management and also demand management. It also covers the container storage, loading and unloading."}
              </p>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {dbData?.content_p3 || "An efficient WM gives a cutting edge to retail chain distribution. The company identifies the customer needs and assist to handle in the best possible manner. The company has expertise in handling vanning and devanning of consolidation cargo and arranges to distribute/deliver to respective parties from the warehouse which delivers full satisfaction to its customers."}
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
            <h2 className="text-4xl font-bold text-black mb-4">Warehouse Features</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: dbData?.benefit_1_icon || "Database",
                title: dbData?.benefit_1_title || "Advanced WMS",
                description: dbData?.benefit_1_desc || "Sophisticated warehouse management system for optimal efficiency"
              },
              {
                icon: dbData?.benefit_2_icon || "Package",
                title: dbData?.benefit_2_title || "Flexible Storage",
                description: dbData?.benefit_2_desc || "Various storage options including temperature-controlled environments"
              },
              {
                icon: dbData?.benefit_3_icon || "BarChart3",
                title: dbData?.benefit_3_title || "Real-time Analytics",
                description: dbData?.benefit_3_desc || "Live inventory tracking and comprehensive reporting dashboard"
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
export default Warehousing;
