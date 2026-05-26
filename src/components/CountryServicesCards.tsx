// components/CountryServicesCards.tsx

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import ScrollAnimation from "./ScrollAnimation";
import {
  Shield,
  Plane,
  Warehouse,
  Truck,
  Ship,
} from "lucide-react";

interface ServiceCardProps {
  title: string;
  icon: React.ElementType;
  delay: number;
  image: string;
  slug: string;
}

const iconMap: Record<string, any> = {
  Shield,
  Plane,
  Warehouse,
  Truck,
  Ship,
};

interface CountryServicesProps {
  country?: 'india' | 'indonesia' | 'malaysia' | 'thailand';
}

const CountryServicesCards = ({ country = 'india' }: CountryServicesProps) => {
  const countryServices: Record<string, ServiceCardProps[]> = {
    india: [
      {
        title: "Customs Clearance",
        icon: Shield,
        delay: 0,
        image: "/customclearance.png",
        slug: "customs-clearance"
      },
      {
        title: "Digital Forwarding",
        icon: Plane,
        delay: 100,
        image: "/airfreight.png",
        slug: "air-freight"
      },
      {
        title: "Warehousing",
        icon: Warehouse,
        delay: 200,
        image: "/warehousing.png",
        slug: "warehousing"
      },
    ],
    indonesia: [
      {
        title: "Project Cargo",
        icon: Truck,
        delay: 0,
        image: "/projectcargo.png",
        slug: "project-cargo"
      },
      {
        title: "Digital Forwarding",
        icon: Plane,
        delay: 100,
        image: "/airfreight.png",
        slug: "air-freight"
      },
      {
        title: "Liner Agency",
        icon: Ship,
        delay: 200,
        image: "/linearagency.png",
        slug: "liner-agency"
      }
    ],
    malaysia: [
      {
        title: "Liquid Logistics",
        icon: Truck,
        delay: 0,
        image: "/liquidtransportation.png",
        slug: "liquid-cargo"
      },
      {
        title: "Digital Forwarding",
        icon: Plane,
        delay: 100,
        image: "/airfreight.png",
        slug: "air-freight"
      },
      {
        title: "Warehousing",
        icon: Warehouse,
        delay: 200,
        image: "/warehousing.png",
        slug: "warehousing"
      }
    ],
    thailand: [
      {
        title: "Air Freight",
        icon: Plane,
        delay: 0,
        image: "/airfreight.png",
        slug: "air-freight"
      },
      {
        title: "Ocean Freight",
        icon: Ship,
        delay: 100,
        image: "/oceanfreight.png",
        slug: "ocean-freight"
      },
      {
        title: "Warehousing",
        icon: Warehouse,
        delay: 200,
        image: "/warehousing.png",
        slug: "warehousing"
      }
    ]
  };

  const [servicesData, setServicesData] = useState<ServiceCardProps[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('*').eq('is_enabled', true).order('priority', { ascending: true });
      if (data && data.length > 0) {
        const slugs = countryServices[country]?.map(s => s.slug) || [];
        const matched = slugs.map((slug, index) => {
          const dbSvc = data.find(d => d.slug === slug);
          const fallback = countryServices[country].find(s => s.slug === slug);
          if (dbSvc) {
            return { title: dbSvc.title, icon: iconMap[dbSvc.icon] || fallback?.icon || Warehouse, delay: index * 100, image: dbSvc.image, slug: dbSvc.slug };
          }
          return fallback;
        }).filter(Boolean) as ServiceCardProps[];
        
        setServicesData(matched);
      } else {
        setServicesData(countryServices[country] || []);
      }
    };
    fetchServices();
  }, [country]);

  const ServiceCard = ({ title, icon: Icon, delay, image, slug }: ServiceCardProps) => (
    <ScrollAnimation
      delay={delay}
      className="group relative overflow-hidden bg-white shadow-lg rounded-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
    >
      <Link to={`/${country}/services/${slug}`}>
        <div className="aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <div className="transform transition-all duration-500 group-hover:-translate-y-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-500/80 backdrop-blur-sm rounded-lg">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
          </div>
        </div>
      </Link>
    </ScrollAnimation>
  );

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimation className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Our Core Services
          </h2>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountryServicesCards;
