import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollAnimation from "./ScrollAnimation";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { getCurrentCountryFromPath } from "@/services/countryDetection";

const defaultFeatures = [
  {
    id: 'def-1',
    title: "Bespoke Logistics Solutions",
    description: "We provide efficient, cost-effective, and innovative global logistics solutions with end-to-end service packages.",
    icon: 'Truck',
  },
  {
    id: 'def-2',
    title: "Service Driven",
    description: "We deliver the highest quality service and are known for being the most customer-focused logistics company.",
    icon: 'Handshake',
  },
  {
    id: 'def-3',
    title: "Overseas Network",
    description: "With a strong network of international representatives, we offer comprehensive global freight solutions.",
    icon: 'Globe',
  },
  {
    id: 'def-4',
    title: "Built To Deliver",
    description: "Our reliable and cost-effective logistics build lasting partnerships with our clients worldwide.",
    icon: 'PackageCheck',
  }
];

const UpdatesSection = () => {
  const [dbFeatures, setDbFeatures] = useState<any[]>([]);
  const location = useLocation();
  const detected = getCurrentCountryFromPath(location.pathname);
  const countryName = detected?.code === "SG" ? "singapore" : (detected?.name?.toLowerCase() || "singapore");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('homepage_features').select('*').eq('country', countryName).eq('is_active', true).order('priority', { ascending: true });
        if (data && data.length > 0) {
            setDbFeatures(data);
        } else {
            const { data: sgData } = await supabase.from('homepage_features').select('*').eq('country', 'singapore').eq('is_active', true).order('priority', { ascending: true });
            if (sgData && sgData.length > 0) setDbFeatures(sgData);
        }
      } catch (err) {
        console.error("Error fetching features:", err);
      }
    };
    fetchData();
  }, [countryName]);

  // Guaranteed fallback to old content if DB is empty or missing a title
  const featuresList = dbFeatures.length > 0 && dbFeatures[0].title ? dbFeatures : defaultFeatures;

  if (featuresList.length === 0) return null;

  return (
    <section className="py-16 bg-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimation className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Why Choose Our Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to excellence in every aspect of logistics, offering solutions that meet your unique requirements.
          </p>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {featuresList.map((feature, index) => {
            const IconComponent = (Icons as any)[feature.icon || 'CheckCircle'] || Icons.CheckCircle;
            return (
            <ScrollAnimation key={feature.id} delay={index * 200} className="feature-card">
              <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
                <div className="bg-kargon-red/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <IconComponent className="text-kargon-red" size={24} />
                </div>
                <h3 className="font-bold text-lg mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 flex-grow">{feature.description}</p>
                <Button
                  variant="ghost"
                  className="text-kargon-red hover:text-kargon-red/90 hover:bg-kargon-red/10 mt-auto p-0 flex items-center gap-1 w-fit"
                >
                  LEARN MORE
                </Button>
              </div>
            </ScrollAnimation>
          )})}
        </div>

        
      </div>
    </section>
  );
};

export default UpdatesSection;
