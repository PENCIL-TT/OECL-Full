import { useEffect, useState } from "react";
import ScrollAnimation from "./ScrollAnimation";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { getCurrentCountryFromPath } from "@/services/countryDetection";

const defaultStats = [
  { id: 'def-1', value: '1M+', label: 'Deliveries Completed', icon: 'FileCheck' },
  { id: 'def-2', value: '10000+', label: 'Happy Clients', icon: 'Smile' },
  { id: 'def-3', value: '100+', label: 'Worldwide Offices', icon: 'Building2' }
];

const StatsSection = () => {
  const [dbStats, setDbStats] = useState<any[]>([]);
  const location = useLocation();
  const detected = getCurrentCountryFromPath(location.pathname);
  const countryName = detected?.code === "SG" ? "singapore" : (detected?.name?.toLowerCase() || "singapore");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('homepage_stats').select('*').eq('country', countryName).order('priority', { ascending: true });
        if (data && data.length > 0) {
            setDbStats(data);
        } else {
            const { data: sgData } = await supabase.from('homepage_stats').select('*').eq('country', 'singapore').order('priority', { ascending: true });
            if (sgData && sgData.length > 0) setDbStats(sgData);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchData();
  }, [countryName]);

  // Guaranteed fallback to old content if DB is empty or missing a value
  const activeStats = dbStats.filter((s: any) => s.is_active && s.value !== 'bg-holder');
  const statsList = activeStats.length > 0 ? activeStats.slice(0, 3) : defaultStats.slice(0, 3);
  const bgImage = dbStats.length > 0 && dbStats[0].background_image ? dbStats[0].background_image : "/lovable-uploads/6fa84550-fe8c-4549-a9c9-c0f071c2cd75.png";

  if (statsList.length === 0) return null;

  return (
    <section className="relative py-16">
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Logistics Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-kargon-dark/80"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 text-center">Our goals <span className="text-kargon-red">in numbers</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {statsList.map((stat, index) => {
            const IconComponent = (Icons as any)[stat.icon || 'CheckCircle'] || Icons.CheckCircle;
            return (
              <ScrollAnimation key={stat.id} className="bg-white/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl p-8 text-center" delay={index * 200}>
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full">
                    <IconComponent className="text-kargon-red h-12 w-12" />
                  </div>
                </div>
                <div className="text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-lg font-medium text-white/80">{stat.label}</div>
              </ScrollAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
