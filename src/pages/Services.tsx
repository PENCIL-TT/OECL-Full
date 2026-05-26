import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import {
  Truck, Plane, Ship, Box, UserCheck, Container, Cuboid
} from "lucide-react";

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

interface Service {
  id: string | number;
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  image: string;
  slug: string;
  button_text: string;
}

interface ServiceCardProps extends Service {
  baseUrl: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title, description, icon: Icon, image, slug, baseUrl, button_text
}) => {
  // If slug is 'services', link to baseUrl only to avoid /services/services
  const url = slug === 'services' ? baseUrl : `${baseUrl}/${slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group grid grid-cols-1 md:grid-cols-2"
    >
      <div className="w-full h-48 md:h-64">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6 flex flex-col justify-center bg-gray-200">
        <div className="bg-red-600/10 text-red-600 p-2 rounded-full inline-block mb-2 w-fit">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-semibold text-black mb-3">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-4">{description}</p>
        <Link
          to={url}
          className="text-red-600 font-medium hover:text-red-800 inline-flex items-center text-sm"
        >
          {button_text || 'Learn More'}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

const Services: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Determine if first segment is 'services' (no country), or country slug
  const firstSegment = pathSegments[0] || "";
  const secondSegment = pathSegments[1] || "";

  // baseUrl for links:
  // If first segment is 'services' (like /services), baseUrl = '/services'
  // Else if path is /:country/services or /:country, baseUrl = '/:country/services'
  // This handles both country-specific and default cases

  let baseUrl = "/services"; // default

  if (firstSegment && firstSegment !== "services") {
    // E.g. /india/services or /india/...
    if (secondSegment === "services") {
      baseUrl = `/${firstSegment}/services`;
    } else {
      // If no /services in path, still add it for service links
      baseUrl = `/${firstSegment}/services`;
    }
  } else if (firstSegment === "services") {
    baseUrl = "/services";
  }

  // Map stored icon strings to the actual Lucide-React components
  const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    Plane,
    Ship,
    Box,
    UserCheck,
    Container,
    Truck,
    Cuboid
  };

  const allServices: Service[] = [
    {
      id: 1,
      title: "Air Freight",
      description: "Fast and efficient air cargo services for time-sensitive shipments.",
      icon: Plane,
      image: "/airfreight.png",
      slug: "air-freight",
      button_text: "Learn More"
    },
    {
      id: 2,
      title: "Ocean Freight",
      description: "Reliable sea freight for bulk and large-volume cargo.",
      icon: Ship,
      image: "/oceanfreight.png",
      slug: "ocean-freight",
      button_text: "Learn More"
    },
    {
      id: 3,
      title: "Warehousing",
      description: "Secure storage and order fulfillment services.",
      icon: Box,
      image: "/warehousing.png",
      slug: "warehousing",
      button_text: "Learn More"
    },
    {
      id: 4,
      title: "Customs Clearance",
      description: "Hassle-free customs handling and documentation support.",
      icon: UserCheck,
      image: "/customclearance.png",
      slug: "customs-clearance",
      button_text: "Learn More"
    },
    {
      id: 5,
      title: "Liner Agency",
      description: "Comprehensive support for liner shipping operations.",
      icon: Container,
      image: "/linearagency.png",
      slug: "liner-agency",
      button_text: "Learn More"
    },
    {
      id: 6,
      title: "Liquid Cargo Transportation",
      description: "Safe transport of chemicals, oils, and liquids.",
      icon: Truck,
      image: "/liquidtransportation.png",
      slug: "liquid-cargo",
      button_text: "Learn More"
    },
    {
      id: 7,
      title: "Consolidation",
      description: "Optimize your logistics by combining multiple shipments.",
      icon: Cuboid,
      image: "/consolidation.png",
      slug: "consolidation",
      button_text: "Learn More"
    },
    {
      id: 8,
      title: "Project Cargo",
      description: "Handling of oversized and complex project shipments.",
      icon: Container,
      image: "/projectcargo.png",
      slug: "project-cargo",
      button_text: "Learn More"
    },
    {
      id: 9,
      title: "3PL",
      description: "Third-party logistics for flexible supply chain solutions.",
      icon: Cuboid,
      image: "/3pl.png",
      slug: "3pl",
      button_text: "Learn More"
    }
  ];

  const [servicesList, setServicesList] = useState<Service[]>(allServices);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, title, description, icon, image, slug, button_text, priority')
          .eq('is_enabled', true)
          .order('priority', { ascending: true });
          
        if (data && data.length > 0) {
          setServicesList(data.map(d => ({
            id: d.id,
            title: d.title,
            description: d.description,
            icon: iconMap[d.icon] || Box,
            image: d.image,
            slug: d.slug,
            button_text: d.button_text || 'Learn More'
          })));
        }
      } catch (err) {
        console.error("Error fetching services", err);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ScrollToTop />
      <Navigation />
      <SEO
        title="Comprehensive B2B Logistics Services | OECL Singapore"
        description="OECL offers end-to-end logistics solutions for businesses, including warehousing, air and ocean freight forwarding, customs clearance, liner agency, liquid cargo transportation, consolidation, project cargo, and 3PL services. Our expertise ensures efficient and reliable supply chain management tailored to your business needs."
        keywords="B2B logistics Singapore, warehousing services, air freight forwarding, ocean freight forwarding, customs clearance, liner agency, liquid cargo transportation, consolidation services, project cargo logistics, 3PL services, OECL logistics"
        url="https://www.oecl.sg/services"
      />
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/lovable-uploads/gp.jpg"
              alt="Services"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-900 opacity-90" />
          </div>
          <div className="container mx-auto px-4 py-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
                Our Logistics Services
              </h1>
              <div className="w-16 h-1 bg-red-600 mx-auto mb-4"></div>
              <p className="text-lg text-white/90">
                Explore our full suite of end-to-end global logistics services.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-black mb-3">All Services</h2>
              <div className="w-20 h-1 bg-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                From freight forwarding to specialized cargo handling, we’ve got it all covered.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {servicesList.map(service => (
                <ServiceCard
                  key={service.id}
                  {...service}
                  baseUrl={baseUrl}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
