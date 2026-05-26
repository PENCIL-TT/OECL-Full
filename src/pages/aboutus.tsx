import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Footer from "@/components/Footer";
import { Truck, Ship, Globe, Users, Award, TrendingUp, CheckCircle, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentCountryFromPath } from "@/services/countryDetection";

const ScrollToTop = () => {
  const {
    pathname
  } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [pathname]);
  return null;
};

const processContentToHtml = (content: string) => {
  let html = content || '';
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-red-600 hover:underline font-medium">$1</a>');
  const bulletListRegex = /(?:^|\n)((?:- .+(?:\n|$))+)/g;
  html = html.replace(bulletListRegex, (match) => {
    const items = match.trim().split('\n').map(item => {
      const cleanItem = item.replace(/^- /, '').trim();
      return `<li class="flex items-start"><span class="text-red-500 mr-3 mt-1.5">&#8226;</span><span>${cleanItem}</span></li>`;
    }).join('');
    return `<ul class="space-y-2 my-4">${items}</ul>`;
  });
  html = html.replace(/\n/g, '<br />');
  html = html.replace(/<br \/>\s*<ul/g, '<ul');
  html = html.replace(/<\/ul>\s*<br \/>/g, '</ul>');
  return html;
};

const AboutUs = () => {
  const [pageData, setPageData] = useState<any>(null);
  const location = useLocation();
  const detected = getCurrentCountryFromPath(location.pathname);
  const countryName = detected?.code === "SG" ? "singapore" : (detected?.name?.toLowerCase() || "singapore");

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const { data } = await supabase.from('about_content').select('*').eq('country', countryName).maybeSingle();
        if (data) {
          setPageData(data);
        } else {
          const { data: sgData } = await supabase.from('about_content').select('*').eq('country', 'singapore').maybeSingle();
          if (sgData) setPageData(sgData);
        }
      } catch (error) {
        console.error("Error fetching about page data:", error);
      }
    };
    fetchPageData();
  }, [countryName]);

  const stats = [{
    number: "30+",
    label: "Years Experience",
    icon: TrendingUp
  }, {
    number: "500+",
    label: "Global Clients",
    icon: Users
  }, {
    number: "50+",
    label: "Countries Served",
    icon: Globe
  }, {
    number: "99%",
    label: "Customer Satisfaction",
    icon: Award
  }];
  
  const featuresList = pageData?.features?.length > 0 ? pageData.features : [
    "World-class logistics services", 
    "Cutting-edge technology solutions", 
    "Dedicated professional team", 
    "Global office network", 
    "24/7 customer support", 
    "Competitive pricing"
  ];
  
  return <div className="bg-black text-white min-h-screen flex flex-col">
      <ScrollToTop />
      <Navigation />
       <SEO
        title="About OECL Singapore | Leading Global Logistics & Supply Chain Partner"
        description="OECL is a premier global logistics and supply chain partner headquartered in Singapore. Established in 2008 by a team of experienced professionals, we offer end-to-end solutions across warehousing, freight forwarding, customs clearance, and more. Our strategic presence in key markets ensures seamless operations for your business worldwide."
        keywords="OECL Singapore, global logistics partner, supply chain solutions, warehousing services, freight forwarding, customs clearance, project cargo, B2B logistics, international logistics, supply chain optimization"
        url="https://www.oecl.sg/about-us"
      />
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-white bg-slate-50"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
          }} className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-950">
                {pageData?.title ? (
                  <>{pageData.title.replace('OECL', '')} <span className="text-red-500">OECL</span></>
                ) : (
                  <>About <span className="text-red-500">OECL</span></>
                )}
              </h1>
              <p className="text-xl max-w-3xl mx-auto leading-relaxed text-slate-950">
                {pageData?.mission || "Your premier global logistics and supply chain partner, delivering excellence across Southeast Asia and beyond"}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              {/* Text Section */}
              <motion.div initial={{
              opacity: 0,
              x: -50
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }} viewport={{
              once: true
            }} className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-red-500 mb-4">{pageData?.story_title || "Our Story"}</h2>
                  
                  {pageData?.content ? (
                    <div 
                      className="text-lg leading-relaxed text-slate-950 space-y-4"
                      dangerouslySetInnerHTML={{ __html: processContentToHtml(pageData.content) }} 
                    />
                  ) : (
                    <>
                      <p className="text-lg leading-relaxed text-slate-950">Established in 2008 by a team of well-experienced professionals, OECL is headquartered in Singapore and stands as one of the premier global logistics and supply chain partners in the region.</p>
                      <p className="text-lg leading-relaxed text-slate-950">With over 30 years of combined experience, we deliver world-class logistics services with passion and commitment across various industries, helping businesses optimize their supply chain operations.</p>
                      <p className="text-lg leading-relaxed font-normal text-slate-950">Our outstanding performance in handling diverse products efficiently is backed by our dedicated team, streamlined processes, and cutting-edge technology that powers our expanding global office network.</p>
                    </>
                  )}
                </div>

                {pageData?.vision && (
                  <div className="mt-8 space-y-4">
                    <h2 className="text-3xl font-bold text-red-500 mb-4">{pageData?.vision_title || "Our Vision"}</h2>
                    <p className="text-lg leading-relaxed text-slate-950">{pageData.vision}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-6">
                  {featuresList.map((feature, index) => <motion.div key={index} initial={{
                  opacity: 0,
                  y: 20
                }} whileInView={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  duration: 0.5,
                  delay: 0.1 * index
                }} viewport={{
                  once: true
                }} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-sm text-slate-950">{feature}</span>
                    </motion.div>)}
                </div>

              </motion.div>

{/* image section*/}
            <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      viewport={{ once: true }}
      className="relative w-full max-w-2xl mx-auto"
    >
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        <img
          src={pageData?.image_url || "/customclearance.png"}
          alt="OECL Operations"
          className="w-full h-96 object-cover"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Floating Label (Bottom Left) */}
        <div className="absolute bottom-4 left-4 bg-white text-red-600 px-6 py-4 rounded-xl shadow-xl">
          <p className="text-3xl font-extrabold">{pageData?.floating_stat_number || "1M+"}</p>
          <p className="text-sm font-medium text-black">{pageData?.floating_stat_label || "Successful Deliveries"}</p>
        </div>
      </div>

      {/* Optional Ship Icon (Bottom Right) */}
      <div className="absolute -bottom-6 -right-6 bg-red-600 p-4 rounded-xl shadow-lg">
        <Ship className="w-8 h-8 text-white" />
      </div>
    </motion.div>
  </div>
          </div>
        </section>

      
      </main>

      <Footer />
    </div>;
};
export default AboutUs;
