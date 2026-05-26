import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import * as Icons from "lucide-react";
import { Box } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ProjectCargo = () => {
  const [dbData, setDbData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('service_page_content').select('*').eq('slug', 'project-cargo').maybeSingle();
        if (data) setDbData(data);
      } catch (err) {
        console.error("Error fetching project cargo content:", err);
      }
    };
    fetchData();
  }, []);
  return <div className="bg-white text-black min-h-screen">
      <Navigation />
       <SEO
        title="B2B Project Cargo Services in Singapore | OECL Logistics"
        description="OECL offers specialized B2B project cargo services in Singapore, handling oversized, heavy-lift, and complex shipments with precision and efficiency. Our team ensures seamless coordination for your project's logistics needs."
        keywords="B2B project cargo Singapore, heavy-lift logistics, oversized cargo transportation, complex project shipments, OECL project cargo, project logistics services, Singapore project cargo solutions, industrial cargo handling, project cargo coordination"
        url="https://www.oecl.sg/services/project-cargo"
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
              <span className="text-red-500 font-semibold">ProjectCargo Services</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              ProjectCargo <span className="text-red-500">Solutions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              State-of-the-art warehouse management with cutting-edge WMS technology
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
                <img src="/projectcargo.png" alt="Warehousing Services" className="w-full h-96 object-cover" />
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
              <h2 className="text-3xl font-bold text-red-500">{dbData?.content_title || "Project Cargo"}</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {dbData?.content_p1 || "We have a dedicated knowledge based project division having skilled experts in the field inherited from major project handlers. OECL are well equipped to handle all kinds of long lengths, over width, over height, heavy lift and complex project cargoes including those that needs floating cranes or tandem lifting."}
              </p>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {dbData?.content_p2 || "We create single solution packages, tailor made to meet our customers specific shipping and transport requirements, to most compass points across the globe, be it port to port or ex-works to door. Our project/heavy-lift breakbulk handling team guides our customers with the right strategy, after doing the feasibility and risk assessment study for every specific jobs."}
              </p>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {dbData?.content_p3 || "Over to this we also provide our customers the knowledge, efficiency and safety, along with the timely communications they need."}
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
export default ProjectCargo;
