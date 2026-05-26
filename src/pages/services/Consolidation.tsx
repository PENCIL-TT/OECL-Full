import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Cuboid } from "lucide-react";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

const Consolidation = () => {
  const [dbData, setDbData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('service_page_content').select('*').eq('slug', 'consolidation').maybeSingle();
        if (data) setDbData(data);
      } catch (err) {
        console.error("Error fetching consolidation content:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white text-black min-h-screen">
      <Navigation />
      <SEO
        title="B2B Cargo Consolidation Services in Singapore | OECL Logistics"
        description="OECL offers efficient B2B cargo consolidation services in Singapore, combining smaller shipments into full container loads (FCL) to reduce costs and improve shipping efficiency."
        keywords="B2B cargo consolidation Singapore, LCL consolidation services, cost-effective shipping solutions, OECL consolidation logistics, freight consolidation Singapore, FCL shipping for businesses, supply chain optimization, logistics consolidation services"
        url="https://www.oecl.sg/services/consolidation"
      />

      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 bg-red-600/20 px-6 py-3 rounded-full mb-6">
              <Cuboid className="w-6 h-6 text-red-500" />
              <span className="text-red-500 font-semibold">Consolidation</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Cargo <span className="text-red-500">Consolidation</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Combine multiple shipments efficiently to save cost and time with our consolidation services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img src="/consolidation.png" alt="Consolidation" className="w-full h-96 object-cover" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-red-500">{dbData?.content_title || "Cargo Consolidation"}</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {dbData?.content_p1 || "OECL's cargo consolidation allows multiple shippers to share space and reduce freight costs, with end-to-end tracking and full transparency."}
              </p>
              {dbData?.content_p2 && <p className="text-gray-700 text-lg leading-relaxed">{dbData.content_p2}</p>}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Consolidation;
