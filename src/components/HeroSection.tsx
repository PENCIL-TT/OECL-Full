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
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);
  const [portalData, setPortalData] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

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
          .select("*")
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
        console.error("Error fetching hero slides:", error);
      }
    };
    fetchSlides();

    const fetchPortalLinks = async () => {
      const { data } = await supabase.from('portal_links').select('*').eq('country', 'singapore').maybeSingle();
      if (data) setPortalData(data);
    };
    fetchPortalLinks();
  }, []);

  const portalLinks = [
    {
      icon: <Users className="w-4 h-4" />,
      title: portalData?.customer_portal_title || "Consolmate",
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
    const handleMouseMove = (e: MouseEvent) => {
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
      {/* Animated Background Particles */}
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
            style={{
              zIndex: activeSlide === i ? 1 : 0,
            }}
          >
            <img
              src={slide.url}
              alt={`Slide ${i}`}
              className="w-full h-full object-cover transition-transform duration-2000"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} z-[1]`}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/40 z-[2]" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex items-center min-h-screen px-6 lg:px-12">
        <div className="max-w-4xl space-y-8 px-0 py-0 mx-auto lg:mx-0 lg:ml-20 lg:text-left text-center w-full">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            {currentSlide.title.split(" ").map((word, i) => (
              <span
                key={i}
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
                className="text-slate-50 font-bold text-4xl"
              >
                {word}{" "}
              </span>
            ))}
          </h1>

          {/* Description */}
          <p
            className={`text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed transform transition-all duration-1000 delay-500 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {currentSlide.description}
          </p>

          {/* CTA Button */}
          <div
            className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <Link to="/contact" className="group hidden md:block">
              <button className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl px-8 py-4 text-lg font-semibold flex items-center gap-3 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-red-500/30 border border-red-500/30">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Zap className="w-5 h-5" />
                <span>GET STARTED</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Slide Indicators */}
          <div className="flex space-x-2 pt-4">
            {sliderImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeSlide === i
                    ? "bg-red-500 scale-125 shadow-lg shadow-red-500/50"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Portal Buttons */}
      <div className="absolute bottom-6 left-0 right-0 z-30 px-4">
        <div
          className={`max-w-7xl mx-auto transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {portalLinks.map((link, index) => {
              const ButtonContent = (
                <div className="group relative overflow-hidden w-full h-14 sm:h-16 md:h-18 flex flex-col gap-1 items-center justify-center text-xs transition-all duration-300 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 hover:-translate-y-1">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-90 group-hover:opacity-100 transition-opacity`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <div className="p-1 bg-white/20 rounded group-hover:bg-white/30 transition-colors">
                      {link.icon}
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-white leading-tight text-xs">
                        {link.title}
                      </div>
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
                    className="w-full"
                  >
                    {ButtonContent}
                  </a>
                );
              } else if (link.onClick) {
                return (
                  <button
                    key={index}
                    onClick={link.onClick}
                    className="w-full"
                  >
                    {ButtonContent}
                  </button>
                );
              } else {
                return (
                  <Link to={link.url} key={index} className="w-full">
                    {ButtonContent}
                  </Link>
                );
              }
            })}
          </div>
        </div>
      </div>

      {/* Partner Portal Modal – single video UI */}
      {isCustomerPortalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[50] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="relative flex justify-center items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900 text-center w-full">
                  {portalData?.partner_portal_title || "Partner Portal"}
                </h2>
                <button
                  onClick={() => setIsCustomerPortalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl absolute right-0"
                >
                  ×
                </button>
              </div>

              {/* Subtitle + Single Video */}
              <div className="space-y-5 text-center">
                <h3 className="font-semibold text-gray-800 text-lg">
                  Tutorial Video
                </h3>
                <div className="max-w-3xl mx-auto">
                  <div className="aspect-video rounded-xl overflow-hidden bg-black">
                    <video controls className="w-full h-full object-cover">
                      <source src="/OECLh.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => setIsCustomerPortalOpen(false)}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>

                <a
                  href={portalData?.partner_portal_url || "https://pp.onlinetracking.co/auth/login/2"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700">
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
