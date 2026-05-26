import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // ✅ Fixed missing import
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ContactMapContainer from '@/components/ContactMapContainer';
import ContactSidebar from '@/components/ContactSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

const GlobalPresence = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    if (isMobile) {
      setShowMap(false);
      setIsSidebarOpen(true);
    } else {
      setShowMap(true);
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/30 to-white">
      <ScrollToTop />
      <Navigation />
      <SEO
        title="OECL Global Presence | International Logistics Solutions"
        description="Explore OECL's extensive global presence, offering comprehensive logistics and supply chain solutions across key markets. Our strategic network ensures seamless operations for your business worldwide."
        keywords="OECL global logistics, international supply chain solutions, global logistics network, OECL worldwide presence, B2B logistics services, global freight forwarding, international warehousing services, OECL supply chain partners"
        url="https://www.oecl.sg/global-presence"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-1 relative overflow-hidden mx-0 my-[80px]"
      >
        {/* Page title for mobile */}
        {isMobile && (
          <div className="fixed top-20 left-0 right-0 z-30 bg-gradient-to-r from-amber-500 to-amber-400 p-3 text-white text-center shadow-md">
            <h1 className="text-lg font-bold">Global Presence</h1>
          </div>
        )}

        {/* Main content with map */}
        {(!isMobile || (isMobile && showMap)) && (
          <motion.main
            initial={isMobile ? { x: '100%' } : { opacity: 0 }}
            animate={isMobile ? { x: 0 } : { opacity: 1 }}
            exit={isMobile ? { x: '100%' } : { opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            className={`transition-all duration-300 ease-in-out ${isMobile ? 'w-full' : 'w-[60%]'}`}
          >
            <ContactMapContainer />
          </motion.main>
        )}

        {/* Sidebar for locations */}
        {(!isMobile || (isMobile && !showMap)) && (
          <motion.div
            initial={isMobile ? { x: '-100%' } : { opacity: 0 }}
            animate={isMobile ? { x: 0 } : { opacity: 1 }}
            exit={isMobile ? { x: '-100%' } : { opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            className={`transition-all duration-300 ease-in-out ${isMobile ? 'w-full pt-12' : 'w-[35%]'}`}
          >
            <ContactSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          </motion.div>
        )}

        {/* Optional toggle buttons can go here if needed */}
      </motion.div>

      <Footer />
    </div>
  );
};

export default GlobalPresence;
