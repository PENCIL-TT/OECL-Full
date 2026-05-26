import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { Box } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ThirdPartyLogistics = () => {
  const [dbData, setDbData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('service_page_content').select('*').eq('slug', '3pl').maybeSingle();
        if (data) setDbData(data);
      } catch (err) {
        console.error("Error fetching 3pl content:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white text-black min-h-screen">
      <Navigation />
        <SEO
        title="B2B 3PL Services in Singapore | OECL Logistics"
        description="OECL offers comprehensive B2B 3PL services in Singapore, including warehousing, fulfillment, transportation, and reverse logistics, to streamline your supply chain operations."
        keywords="B2B 3PL Singapore, third-party logistics services, supply chain management, warehousing solutions, fulfillment services, transportation logistics, reverse logistics, OECL 3PL"
        url="https://www.oecl.sg/services/3pl"
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
              <Box className="w-6 h-6 text-red-500" />
              <span className="text-red-500 font-semibold">3PL</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Third-Party <span className="text-red-500">Logistics</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Flexible and scalable logistics support through professional third-party logistics (3PL) services.
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
                <img src="/3pl.png" alt="3PL" className="w-full h-96 object-cover" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-red-500">{dbData?.content_title || "Third-Party Logistics (3PL)"}</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {dbData?.content_p1 || "OECL offers 3PL services tailored to your supply chain. We manage storage, fulfillment, transportation, and reverse logistics so you can focus on your core business."}
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

export default ThirdPartyLogistics;
