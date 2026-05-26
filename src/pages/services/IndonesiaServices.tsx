
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Ship, Plane, UserCheck, Truck, Box, Cuboid } from "lucide-react";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  
  return null;
};

const ServiceCard = ({ title, description, icon: Icon, image, link }) => {
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
          to={link}
          className="text-red-600 font-medium hover:text-red-800 inline-flex items-center text-sm"
        >
          Learn More
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

const IndonesiaServices = () => {
  const indonesiaServices = [
    {
      id: 1,
      title: "Ocean Freight",
      description: "Comprehensive ocean freight services connecting Indonesia's archipelago with global shipping networks.",
      icon: Ship,
      image: "/oceanfreight.png",
      link: "/services/ocean-freight"
    },
    {
      id: 2,
      title: "Air Freight",
      description: "Efficient air cargo solutions for Indonesia's diverse islands with rapid transit and reliable delivery.",
      icon: Plane,
      image: "/airfreight.png",
      link: "/services/air-freight"
    },
    {
      id: 3,
      title: "Customs Clearance",
      description: "Expert customs clearance services navigating Indonesia's complex regulatory environment.",
      icon: UserCheck,
      image: "/customclearance.png",
      link: "/services/customs-clearance"
    },
    {
      id: 4,
      title: "Liquid Cargo Transportation",
      description: "Specialized liquid cargo handling for Indonesia's oil, gas, and chemical industries.",
      icon: Truck,
      image: "/liquidtransportation.png",
      link: "/services/liquid-cargo"
    },
    {
      id: 5,
      title: "Warehousing Solutions",
      description: "Strategic warehousing and distribution centers across Indonesia's major commercial hubs.",
      icon: Box,
      image: "/warehousing.png",
      link: "/services/warehousing"
    },
    {
      id: 6,
      title: "Consolidation Services",
      description: "Cost-effective consolidation services optimized for Indonesia's inter-island logistics challenges.",
      icon: Cuboid,
      image: "/consolidation.png",
      link: "/services/consolidation"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ScrollToTop />
      <Navigation />

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
                Our Indonesia Services
              </h1>
              <div className="w-16 h-1 bg-red-600 mx-auto mb-4"></div>
              <p className="text-lg text-white/90">
                Comprehensive logistics solutions for Indonesia's vast archipelago and growing economy.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Service Cards */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-black mb-3">Indonesia Services Portfolio</h2>
              <div className="w-20 h-1 bg-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Specialized logistics services designed for Indonesia's unique geographic and economic landscape.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {indonesiaServices.map(service => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default IndonesiaServices;
