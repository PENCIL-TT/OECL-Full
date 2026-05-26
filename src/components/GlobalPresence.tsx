import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { getCurrentCountryFromPath } from "@/services/countryDetection";

const globalPresenceCountries = [
  { name: "Singapore", website: "https://www.oecl.sg/global-presence", flag: "/sg.svg", slug: "", isExternal: false },
  { name: "Malaysia", website: "https://www.oecl.sg/malaysia/global-presence", flag: "/my.svg", slug: "malaysia", isExternal: false },
  { name: "Indonesia", website: "https://www.oecl.sg/indonesia/global-presence", flag: "/id.svg", slug: "indonesia", isExternal: false },
  { name: "Thailand", website: "https://www.oecl.sg/thailand/global-presence", flag: "/th.svg", slug: "thailand", isExternal: false },
  { name: "Myanmar", website: "https://www.globalconsol.com/myanmar/home", flag: "/mm.svg", slug: "myanmar", isExternal: true },
  { name: "China", website: "https://www.haixun.co/", flag: "/cn.svg", slug: "china", isExternal: true },
  { name: "Australia", website: "https://www.gglaustralia.com/", flag: "/au.svg", slug: "australia", isExternal: true },
  { name: "India", website: "https://www.oecl.sg/india/global-presence", flag: "/in.svg", slug: "india", isExternal: false },
  { name: "Sri Lanka", website: "https://www.globalconsol.com/sri-lanka/home", flag: "/lk.svg", slug: "sri-lanka", isExternal: true },
  { name: "Pakistan", website: "https://www.globalconsol.com/pakistan/home", flag: "/pk.svg", slug: "pakistan", isExternal: true },
  { name: "Qatar", website: "https://oneglobalqatar.com/", flag: "/qa.svg", slug: "qatar", isExternal: true },
  { name: "Saudi Arabia", website: "https://amassmiddleeast.com/", flag: "/sa.svg", slug: "saudi-arabia", isExternal: true },
  { name: "UAE", website: "https://www.futurenetlogistics.com/", flag: "/ae.svg", slug: "uae", isExternal: true },
  { name: "USA", website: "https://gglusa.us/", flag: "/us.svg", slug: "usa", isExternal: true },
  { name: "UK", website: "https://www.ggl.sg/uk", flag: "/gb.svg", slug: "uk", isExternal: true }
];

const GlobalPresence = () => {
  const location = useLocation();
  const detected = getCurrentCountryFromPath(location.pathname);
  const countryName = detected?.code === "SG" ? "singapore" : (detected?.name?.toLowerCase() || "singapore");
  const [dbData, setDbData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('homepage_global_presence').select('*').eq('country', countryName).maybeSingle();
        if (data) {
          setDbData(data);
        } else {
          const { data: sgData } = await supabase.from('homepage_global_presence').select('*').eq('country', 'singapore').maybeSingle();
          if (sgData) setDbData(sgData);
        }
      } catch (err) {
        console.error("Error fetching global presence:", err);
      }
    };
    fetchData();
  }, [countryName]);

  const countrySlug = location.pathname.split("/")[1];
  const targetRoute = ["india", "malaysia", "indonesia", "thailand"].includes(countrySlug?.toLowerCase()) 
    ? `/${countrySlug.toLowerCase()}/global-presence` 
    : '/global-presence';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
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
            <h2 className="text-3xl md:text-4xl font-bold text-white">{dbData?.title || "Global Presence"}</h2>
          </motion.div>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-4"></div>
          <p className="text-white/80 max-w-2xl mx-auto text-lg md:text-xl">
            {dbData?.description || "Our logistics network spans across continents, enabling seamless global shipping solutions."}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 mt-12 mb-12 max-w-5xl mx-auto"
        >
          {globalPresenceCountries.map((country, index) => (
            <motion.div
              key={country.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-2"
            >
              {country.isExternal ? (
                <a href={country.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group w-full">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 p-1 group-hover:bg-red-600 transition-colors mx-auto shadow-lg">
                    <img src={country.flag} alt={country.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors text-center">{country.name}</span>
                </a>
              ) : (
                <Link to={country.slug ? `/${country.slug}/global-presence` : "/global-presence"} className="flex flex-col items-center gap-2 group w-full">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 p-1 group-hover:bg-red-600 transition-colors mx-auto shadow-lg">
                    <img src={country.flag} alt={country.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors text-center">{country.name}</span>
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
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
              {dbData?.button_text || "Explore Our Global Network"} <ExternalLink size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default GlobalPresence;
