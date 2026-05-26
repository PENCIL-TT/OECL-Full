import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { getCurrentCountryFromPath } from "@/services/countryDetection";

const GlobalPresence = () => {
  const location = useLocation();
  const detected = getCurrentCountryFromPath(location.pathname);
  const countryName =
    detected?.code === "SG"
      ? "singapore"
      : (detected?.name?.toLowerCase() || "singapore");

  const [dbData, setDbData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase
          .from('homepage_global_presence')
          .select('*')
          .eq('country', countryName)
          .maybeSingle();

        if (data) {
          setDbData(data);
        } else {
          const { data: sgData } = await supabase
            .from('homepage_global_presence')
            .select('*')
            .eq('country', 'singapore')
            .maybeSingle();

          if (sgData) setDbData(sgData);
        }
      } catch (err) {
        console.error("Error fetching global presence:", err);
      }
    };

    fetchData();
  }, [countryName]);

  const countrySlug = location.pathname.split("/")[1];

  const targetRoute = ["india", "malaysia", "indonesia", "thailand"].includes(
    countrySlug?.toLowerCase()
  )
    ? `/${countrySlug.toLowerCase()}/global-presence`
    : '/global-presence';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="bg-black text-white py-8 px-0"
    >
      <div className="container mx-auto px-4">

        {/* Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-3 mb-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Globe className="h-10 w-10 text-red-600" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {dbData?.title || "Global Presence"}
            </h2>
          </motion.div>

          <div className="w-24 h-1 bg-red-600 mx-auto mb-4"></div>

          <p className="text-white/80 max-w-2xl mx-auto text-lg md:text-xl">
            {dbData?.description ||
              "Our logistics network spans across continents, enabling seamless global shipping solutions."}
          </p>
        </div>

        {/* Button Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link to={targetRoute}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-lg shadow-lg transition-all duration-300 px-6 py-3"
            >
              {dbData?.button_text || "Explore Our Global Network"}

              <ExternalLink size={20} />
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default GlobalPresence;
