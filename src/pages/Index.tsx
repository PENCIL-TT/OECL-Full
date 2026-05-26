
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TrackOrder from "@/components/TrackOrder";
import ServicesCards from "@/components/ServicesCards";
import AboutSection from "@/components/AboutSection";
import GlobalPresence from "@/components/GlobalPresence";
import ServicesSection from "@/components/ServicesSection";
import SEO from "@/components/SEO";
import WorkflowSection from "@/components/WorkflowSection";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import UpdatesSection from "@/components/UpdatesSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import CertificationSg from "@/components/CertificationSg";
import { useLocation, Link } from 'react-router-dom';

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

const Index = () => {
  useEffect(() => {
    // Initialize scroll animations
    const handleScroll = () => {
      const scrollAnimElements = document.querySelectorAll('.scroll-animate');
      scrollAnimElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight * 0.9) {
          element.classList.add('appear');
        }
      });
    };

    // Initial check on load
    setTimeout(handleScroll, 100);

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-white">
      <SEO
        title="OECL Singapore | Global Logistics & Supply Chain Solutions"
        description="OECL is a premier global logistics and supply chain partner, offering end-to-end solutions including warehousing, freight forwarding, customs clearance, and project cargo services. With a presence across Southeast Asia, South Asia, the Middle East, and select Western countries, we deliver reliable, efficient, and tech-driven logistics solutions tailored to your business needs."
        keywords="B2B logistics Singapore, global supply chain solutions, warehousing services, freight forwarding, customs clearance, project cargo, OECL logistics, international logistics partner, supply chain optimization"
        url="https://www.oecl.sg/home"
      />
      <Navigation />
      <ScrollToTop />
      <HeroSection />
      <TrackOrder />
      <ServicesCards />
      <AboutSection />
      <CertificationSg />
      <ServicesSection />
      <WorkflowSection />
      <StatsSection />
      <GlobalPresence />
      <UpdatesSection />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
