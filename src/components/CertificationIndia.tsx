import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentCountryFromPath } from "@/services/countryDetection";

const defaultImages = [
  "/certificate4.jpg",
  "/certficate1.jpg",
  "/certificate3.jpg",
  "/certificate2.jpg",
  "/AEO.jpg",
  "/certificate6.jpeg", // ensure no trailing space
  "/MTO.jpg",
];

const CertificationIndia: React.FC = () => {
  const location = useLocation();
  const detected = getCurrentCountryFromPath(location.pathname);
  const countryName = detected?.code === "SG" ? "singapore" : (detected?.name?.toLowerCase() || "singapore");

  const [certData, setCertData] = useState<any>(null);

  useEffect(() => {
    const fetchCertData = async () => {
      try {
        const { data } = await supabase
          .from("certification_content")
          .select("*")
          .eq("country", countryName)
          .maybeSingle();

        if (data) {
          setCertData(data);
        } else {
          const { data: sgData } = await supabase
            .from("certification_content")
            .select("*")
            .eq("country", "singapore")
            .maybeSingle();
          if (sgData) setCertData(sgData);
        }
      } catch (error) {
        console.error("Error fetching certification grid data:", error);
      }
    };
    fetchCertData();
  }, [countryName]);

  const images = [
    certData?.grid_image_1 || defaultImages[0],
    certData?.grid_image_2 || defaultImages[1],
    certData?.grid_image_3 || defaultImages[2],
    certData?.grid_image_4 || defaultImages[3],
    certData?.grid_image_5 || defaultImages[4],
    certData?.grid_image_6 || defaultImages[5],
    certData?.grid_image_7 || defaultImages[6],
    certData?.grid_image_8,
  ].filter(Boolean); // Filters out undefined/empty slots so only uploaded items render

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-8 md:py-12">
      <div className="mx-auto px-4 md:px-6 max-w-[1600px]">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600">
              {certData?.grid_title || "Certifications"}
            </span>
          </h2>
          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-amber-600 to-yellow-400" />
        </div>

        {/* Desktop: 4 + 4 cards (no empty slot) */}
        <div className="hidden lg:flex flex-col gap-8">
          {/* Row 1: 4 items */}
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-8">
              {images.slice(0, 4).map((src, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex items-center justify-center"
                >
                  <img
                    src={src}
                    alt={`Certification ${i + 1}`}
                    loading="lazy"
                    className="w-full h-[22rem] xl:h-[26rem] 2xl:h-[28rem] object-contain"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Row 2: 4 items (fixed slice) */}
          {images.length > 4 && (
            <div className="grid grid-cols-4 gap-8">
              {images.slice(4, 8).map((src, i) => (
                <div
                  key={i + 4}
                  className="rounded-2xl border border-slate-200 bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex items-center justify-center"
                >
                  <img
                    src={src}
                    alt={`Certification ${i + 5}`}
                    loading="lazy"
                    className="w-full h-[22rem] xl:h-[26rem] 2xl:h-[28rem] object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile/Tablet: horizontal scroll */}
        <div className="lg:hidden overflow-x-auto">
          <div className="flex flex-nowrap gap-6">
            {images.map((src, i) => (
              <div
                key={i}
                className="shrink-0 w-[280px] sm:w-[320px] rounded-2xl border border-slate-200 bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 flex items-center justify-center"
              >
                <img
                  src={src}
                  alt={`Certification ${i + 1}`}
                  loading="lazy"
                  className="w-full h-80 sm:h-96 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationIndia;
