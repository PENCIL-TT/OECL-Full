import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Container } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LinearAgency = () => {
  const [dbData, setDbData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('service_page_content').select('*').eq('slug', 'liner-agency').maybeSingle();
        if (data) setDbData(data);
      } catch (err) {
        console.error("Error fetching liner agency content:", err);
      }
    };
    fetchData();
  }, []);

  return <div className="bg-white text-black min-h-screen">
      <Navigation />
      
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
              <Container className="w-6 h-6 text-red-500" />
              <span className="text-red-500 font-semibold">Linear Agency Services</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Linear Agency <span className="text-red-500">Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Professional shipping line representation and comprehensive port agency services
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
                <img src="/linearagency.png" alt="Linear Agency Services" className="w-full h-96 object-cover" />
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
              <h2 className="text-3xl font-bold text-red-500">{dbData ? dbData.content_title : "Liner Agency"}</h2>
              
              {dbData ? (
                <>
                  {dbData.content_p1 && <p className="text-gray-700 text-lg leading-relaxed mb-4 whitespace-pre-line">{dbData.content_p1}</p>}
                  {dbData.content_p2 && <p className="text-gray-700 text-lg leading-relaxed mb-4 whitespace-pre-line">{dbData.content_p2}</p>}
                  {dbData.content_p3 && <p className="text-gray-700 text-lg leading-relaxed mb-4 whitespace-pre-line">{dbData.content_p3}</p>}
                </>
              ) : (
                <>
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    OECL has liner division which is representing many medium to small carriers who use our local knowledge and expertise to handle and market their products.We provide first class liner and port agency services, together with an extensive range of related services to liners who trust our company knowing the potential and people in the management and their experience.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    Highly dedicated, enthusiastic and professional employees, providing top quality service, have swiftly turned Overseas Express Container Lines into a well-established agency, with a remarkable reputation in all aspects.With dedicated trained personnel for each principals OECL ensures equal attention and care in order to protect every principal's interest.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    With shipping industry going through many changes, OECL helps shipping carriers to optimize their resources by providing local support to ensure a win-win formula. We provide full range of general agency to various elements of shipping support and our services are tailored to meet the exact needs of principals in this fast changing global liner shipping environment.
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default LinearAgency;