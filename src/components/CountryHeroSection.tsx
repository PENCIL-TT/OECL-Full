import React, { useState, useEffect } from "react";
import {
  Users,
  UserCircle,
  SearchCode,
  Ship,
  ArrowRight,
  Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useLocation } from "react-router-dom";

const HeroSection = () => {
  const location = useLocation();

  const [isVisible, setIsVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);
  const [portalData, setPortalData] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  /* -------- Detect Country From URL -------- */
  const getCountry = () => {
    const path = location.pathname.split("/")[1];

    if (path === "malaysia") return "malaysia";
    if (path === "indonesia") return "indonesia";
    if (path === "thailand") return "thailand";
    if (path === "india") return "india";

    return "";
  };

  const country = getCountry();

  /* -------- Dynamic Contact Redirect -------- */
  const contactRoute = country ? `/${country}/contact` : "/contact";

  /* -------- Dynamic Portal Title -------- */
  const getPortalTitle = () => {
    if (country === "malaysia") return "Consolmate";
    if (country === "indonesia" || country === "thailand")
      return "Customer Portal";
    return "Customer Portal";
  };

  const defaultSlides = [
    { url: "/h1.png", title: "OECL", description: "Vital Link to Enhance Your Supply Chain.", gradient: "" },
    { url: "/h2.png", title: "LOGISTICS SERVICES", description: "Supported through own offices and network of key partners around the world.", gradient: "" },
    { url: "/h3.png", title: "WAREHOUSE MANAGEMENT", description: "A cutting edge solutions with advanced WMS .", gradient: "" },
    { url: "/h4.png", title: "MULTIPLE CARRIER OPTION", description: "Assured space with contracted rates to major trade routes .", gradient: "" }
  ];
  const [sliderImages, setSliderImages] = useState(defaultSlides);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data } = await supabase
          .from("hero_slides")
          .select("*") // Since slides are the same for all countries, we use 'singapore' as the master global source
          .eq("country", "singapore")
          .eq("is_active", true)
          .order("priority", { ascending: true });
          
        if (data && data.length > 0) {
          setSliderImages(data.map(slide => ({
            url: slide.image_url,
            title: slide.title,
            description: slide.description || "",
            gradient: ""
          })));
        }
      } catch (error) {
        console.error("Error fetching country hero slides:", error);
      }
    };
    fetchSlides();

    const fetchPortalLinks = async () => {
      const targetCountry = country || 'singapore';
      const { data } = await supabase.from('portal_links').select('*').eq('country', targetCountry).maybeSingle();
      if (data) setPortalData(data);
    };
    fetchPortalLinks();
  }, []);

  const portalLinks = [
    {
      icon: <Users className="w-4 h-4" />,
      title: portalData?.customer_portal_title || getPortalTitle(),
      url: portalData?.customer_portal_url || "https://consolmate.com/auth/login/2",
      external: true,
      color: "from-red-500 to-red-700",
      hoverColor: "from-red-600 to-red-800",
    },
    {
      icon: <UserCircle className="w-4 h-4" />,
      title: portalData?.partner_portal_title || "Partner Portal",
      external: false,
      onClick: () => setIsCustomerPortalOpen(true),
      color: "from-red-500 to-red-700",
      hoverColor: "from-red-600 to-red-800",
    },
    {
      icon: <SearchCode className="w-4 h-4" />,
      title: portalData?.tracking_title || "Tracking",
      url: portalData?.tracking_url || "http://ec2-13-229-38-56.ap-southeast-1.compute.amazonaws.com:8081/ords/f?p=107:102:::::P0_GROUP_RID:55",
      external: true,
      color: "from-red-500 to-red-700",
      hoverColor: "from-red-600 to-red-800",
    },
    {
      icon: <Ship className="w-4 h-4" />,
      title: portalData?.sailing_schedule_title || "Sailing Schedule",
      url: portalData?.sailing_schedule_url || "http://ec2-13-229-38-56.ap-southeast-1.compute.amazonaws.com:8081/ords/f?p=107:104:::::P0_GROUP_RID:55",
      external: true,
      color: "from-red-500 to-red-700",
      hoverColor: "from-red-600 to-red-800",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliderImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const currentSlide = sliderImages[activeSlide];

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Background Slider */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {sliderImages.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-2000 ease-in-out ${
              activeSlide === i
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <img
              src={slide.url}
              alt={`Slide ${i}`}
              className="w-full h-full object-cover transition-transform duration-2000"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex items-center min-h-screen px-6 lg:px-12">
        <div className="max-w-4xl space-y-8 mx-auto lg:ml-20 text-center lg:text-left w-full">
          <h1 className="text-4xl font-bold">{currentSlide.title}</h1>

          <p
            className={`text-xl text-gray-200 transition-all duration-1000 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {currentSlide.description}
          </p>

          {/* GET STARTED Dynamic Country Redirect */}
          <Link to={contactRoute} className="group hidden md:block">
            <button className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl px-8 py-4 text-lg font-semibold flex items-center gap-3 shadow-2xl transition-all duration-300 hover:scale-105">
              <Zap className="w-5 h-5" />
              <span>GET STARTED</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
      </div>

      {/* Portal Buttons */}
      <div className="absolute bottom-6 left-0 right-0 z-30 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {portalLinks.map((link, index) => {
              const ButtonContent = (
                <div className="group relative overflow-hidden w-full h-14 flex flex-col items-center justify-center text-xs rounded-lg shadow-md hover:scale-105 transition">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${link.color}`}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <div className="p-1 bg-white/20 rounded">
                      {link.icon}
                    </div>
                    <div className="font-medium text-white">
                      {link.title}
                    </div>
                  </div>
                </div>
              );

              if (link.external) {
                return (
                  <a
                    href={link.url}
                    key={index}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ButtonContent}
                  </a>
                );
              }

              return (
                <button key={index} onClick={link.onClick}>
                  {ButtonContent}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Partner Portal Modal */}
      {isCustomerPortalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                {portalData?.partner_portal_title || "Partner Portal"}
              </h2>

              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                <video controls className="w-full h-full">
                  <source src="/OECLh.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => setIsCustomerPortalOpen(false)}
                  className="px-5 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>

                <a
                  href={portalData?.partner_portal_url || "https://pp.onlinetracking.co/auth/login/2"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-md">
                    Login
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
