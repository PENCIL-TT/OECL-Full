import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import CountryHeroSection from "@/components/CountryHeroSection";
import TrackOrder from "@/components/TrackOrder";
import CountryServicesCards from "@/components/CountryServicesCards";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import WorkflowSection from "@/components/WorkflowSection";
import StatsSection from "@/components/StatsSection";
import CertificationIndia from "@/components/CertificationIndia";
import TestimonialsSection from "@/components/TestimonialsSection";
import CertificationSg1 from "@/components/CertificationSg1";
import GlobalPresence from "@/components/GlobalPresence";
import UpdatesSection from "@/components/UpdatesSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop"; // ✅ correct usage

const IndiaHome = () => {
  useScrollToTop(); // ✅ hook should be called, not rendered

  useEffect(() => {
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

    setTimeout(handleScroll, 100);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-white">
      <Navigation />
      <CountryHeroSection country="india" />
      <TrackOrder />
      <CountryServicesCards country="india" />
      <AboutSection />
      <CertificationSg1 />
      <CertificationIndia />
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

export default IndiaHome;
