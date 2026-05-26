import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Ship } from "lucide-react";
import { motion } from "framer-motion";
import ScrollAnimation from "./ScrollAnimation";
import { supabase } from "@/integrations/supabase/client";
import { Link, useLocation } from "react-router-dom";
import { getCurrentCountryFromPath } from "@/services/countryDetection";

interface AboutContent {
  title: string;
  block1_title1: string;
  block1_title2: string;
  block1_desc: string;
  block2_title1: string;
  block2_title2: string;
  block2_desc: string;
  stats_number: string;
  stats_label: string;
  image_url: string | null;
}

const AboutSection = () => {
  const [aboutData, setAboutData] = useState<AboutContent | null>(null);
  const location = useLocation();
  
  const detected = getCurrentCountryFromPath(location.pathname);
  const countryName = detected?.code === "SG" ? "singapore" : (detected?.name?.toLowerCase() || "singapore");
  const country = detected?.code ? detected : { code: "SG", name: "singapore" };

  const getNavLink = (basePath: string) => {
    if (!country || country.code === "SG") return basePath;
    const slug = country.name.toLowerCase().replace(/\s+/g, "-");
    return `/${slug}${basePath}`;
  };

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const { data } = await supabase
          .from("homepage_about")
          .select("*")
          .eq("country", countryName)
          .maybeSingle();
          
        if (data) {
          setAboutData(data);
        } else {
          // Fallback to Singapore if country-specific not found
          const { data: sgData } = await supabase
            .from("homepage_about")
            .select("*")
            .eq("country", "singapore")
            .maybeSingle();
          if (sgData) setAboutData(sgData);
        }
      } catch (error) {
        console.error("Error fetching about section data:", error);
      }
    };
    fetchAboutData();
  }, []);

  return (
    <section className="bg-milk-texture bg-slate-100 py-[114px]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Text Section */}
          <div className="order-2 lg:order-1">
            <ScrollAnimation>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{aboutData?.title || "About Us"}</h2>
              <div className="w-16 h-1 bg-kargon-red mb-6"></div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="text-kargon-red shrink-0 mr-3 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-lg">{aboutData?.block1_title1 || "Established in 2008 and headquartered in Singapore"}</h3>
                    {aboutData?.block1_title2 && (
                      <h3 className="font-semibold text-lg">{aboutData.block1_title2}</h3>
                    )}
                    <p className="text-gray-600">
                      {aboutData?.block1_desc || "OECL is a premier global logistics and supply chain partner founded by experienced professionals. With over 30 years of service across various industries, the company is known for its passionate and efficient delivery of world-class logistics solutions."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="text-kargon-red shrink-0 mr-3 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-lg">{aboutData?.block2_title1 || "Global Expansion Driven by Innovation and Excellence"}</h3>
                    {aboutData?.block2_title2 && (
                      <h3 className="font-semibold text-lg">{aboutData.block2_title2}</h3>
                    )}
                    <p className="text-gray-600">
                      {aboutData?.block2_desc || "OECL’s growth is driven by a dedicated team, simplified processes, and advanced technology, enabling global office expansion. The company is well-positioned to meet international market demands and has firm plans to expand further across Southeast Asia."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-kargon-red hover:bg-kargon-red/90 text-white rounded-md">
                  <Link to={getNavLink("/about-us")}>
                    Know More
                  </Link>
                </Button>
              </div>
            </ScrollAnimation>
          </div>

          {/* Animated Image Section */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative w-full max-w-2xl mx-auto"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={aboutData?.image_url || "/lovable-uploads/14af4f37-de1e-4e64-b5d7-b6a53ec592d7.png"}
                  alt="Container Port"
                  className="w-full h-96 object-cover"
                  loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Floating Label (Bottom Left) */}
                <div className="absolute bottom-4 left-4 bg-white text-red-600 px-6 py-4 rounded-xl shadow-xl">
                  <p className="text-3xl font-extrabold">{aboutData?.stats_number || "1M+"}</p>
                  <p className="text-sm font-medium text-black">{aboutData?.stats_label || "Successful Deliveries"}</p>
                </div>
              </div>

              {/* Ship Icon (Bottom Right) */}
              <div className="absolute -bottom-6 -right-6 bg-red-600 p-4 rounded-xl shadow-lg">
                <Ship className="w-8 h-8 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
