import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import * as Icons from "lucide-react";
import { Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LiquidCargo = () => {
  const [dbData, setDbData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('service_page_content').select('*').eq('slug', 'liquid-cargo').maybeSingle();
        if (data) setDbData(data);
      } catch (err) {
        console.error("Error fetching liquid cargo content:", err);
      }
    };
    fetchData();
  }, []);
  return <div className="bg-white text-black min-h-screen">
      <Navigation />
      <SEO
        title="B2B Liquid Cargo Transportation Services | OECL Singapore"
        description="OECL offers specialized B2B liquid cargo transportation solutions in Singapore, utilizing ISO Tanks, Flexi Tanks, and IBCs for safe and efficient handling of hazardous and non-hazardous liquids."
        keywords="B2B liquid cargo Singapore, liquid cargo transportation, hazardous liquid logistics, non-hazardous liquid shipping, ISO tank transport, Flexi tank logistics, IBC liquid transport, chemical logistics Singapore, bulk liquid shipping, OECL liquid cargo"
        url="https://www.oecl.sg/services/liquid-cargo"
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
              <Truck className="w-6 h-6 text-red-500" />
              <span className="text-red-500 font-semibold">Liquid Cargo Transportation</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Liquid Cargo <span className="text-red-500">Transportation</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Specialized transportation solutions for liquid cargo with safety and precision
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
                <img src="/liquidtransportation.png" alt="Liquid Cargo Transportation" className="w-full h-96 object-cover" />
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
              <h2 className="text-3xl font-bold text-red-500">{dbData?.content_title || "Liquid Cargo Transportation"}</h2>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {dbData?.content_p1 || "OECL provides expertise and services for carriage of liquid cargoes in ISO Tanks, Flexi Tanks and IBCs (Inter Bulk Containers). OECL provide professional, cost effective and safe transportation of liquid cargo . A well experienced dedicated team provides complete logistics management for door to door movements with complete visibility."}
              </p>
              {dbData?.content_p2 && <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{dbData.content_p2}</p>}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default LiquidCargo;
