import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ScrollAnimation from "./ScrollAnimation";
import { getCurrentCountryFromPath } from "@/services/countryDetection";
import { supabase } from "@/integrations/supabase/client";

type CertificationProps = {
  certificateUrl?: string;
  isoLogoUrl?: string;       // SICCI logo (or override via prop)
  /** Optional additional logos to show in the same row */
  secondLogoUrl?: string;   // SBF logo (or override)
  thirdLogoUrl?: string;    // SLA logo (or override)
};

const CertificationSg: React.FC<CertificationProps> = ({
  certificateUrl,
  isoLogoUrl,
  secondLogoUrl,
  thirdLogoUrl,
}) => {
  const location = useLocation();
  const detected = getCurrentCountryFromPath(location.pathname);
  const countryName = detected?.code === "SG" ? "singapore" : (detected?.name?.toLowerCase() || "singapore");
  const country = detected?.code ? detected : { code: "SG", name: "Singapore" };

  const getNavLink = (basePath: string) => {
    if (!country || country.code === "SG") return basePath;
    const slug = country.name.toLowerCase().replace(/\s+/g, "-");
    return `/${slug}${basePath}`;
  };

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
          // Fallback to Singapore if country-specific not found
          const { data: sgData } = await supabase
            .from("certification_content")
            .select("*")
            .eq("country", "singapore")
            .maybeSingle();
          if (sgData) setCertData(sgData);
        }
      } catch (error) {
        console.error("Error fetching certification data:", error);
      }
    };
    fetchCertData();
  }, [countryName]);

  // Partner/association logos (fallback paths)
  const logos = [
    certData?.logo_1 || isoLogoUrl || "/logo1.jpeg",
    certData?.logo_2 || secondLogoUrl || "/logo2.jpeg",
    certData?.logo_3 || thirdLogoUrl || "/logo3.jpeg",
  ].filter(Boolean); // removes empty logo slots

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-y-0 lg:gap-x-6 xl:gap-x-10 items-start">
          {/* LEFT: event/certificate photo */}
          <div className="order-1 lg:col-span-5 flex sm:justify-center lg:justify-start">
            <div className="relative w-full">
              <img
                src={certData?.main_image || certificateUrl || "/certification.png"}
                alt={certData?.title || "SICCI Centennial Celebration & Entrepreneur Awards"}
                loading="lazy"
                className="w-full h-auto object-contain rounded-xl shadow-lg border border-slate-200
                           max-w-[420px] md:max-w-[460px] lg:max-w-[480px] xl:max-w-[500px]
                           mx-auto lg:mx-0"
              />
            </div>
          </div>

          {/* RIGHT: text & logos */}
          <div className="order-2 lg:col-span-7 text-center lg:text-left">
            <ScrollAnimation>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-9">
                {certData?.title || "SICCI Centennial Celebration & Entrepreneur Awards"}
              </h2>
              <div className="w-16 h-1 bg-gc-gold mt-3 mb-6 mx-auto lg:mx-0" />

              <p 
                className="text-gray-700 leading-relaxed mb-4 max-w-2xl mx-auto lg:mx-0"
                dangerouslySetInnerHTML={{ __html: certData?.description_1 || "A century of excellence and a legacy of leadership — celebrating with the Singapore Indian Chamber of Commerce & Industry (SICCI). We are proud to share this moment as our <strong>Group Chairman, Mr. Jayaprakash</strong>, receives the award, honoring his remarkable leadership and contribution." }}
              />

              <p 
                className="text-gray-700 leading-relaxed mb-6 max-w-2xl mx-auto lg:mx-0"
                dangerouslySetInnerHTML={{ __html: certData?.description_2 || "The award was presented by His Excellency <strong>Mr. Tharman Shanmugaratnam</strong>, President of the Republic of Singapore." }}
              />

              <ul className="list-disc marker:text-gc-gold pl-5 space-y-3 mb-8 max-w-2xl mx-auto lg:mx-0 text-left">
                {certData ? (
                  <>
                    {certData.bullet_1 && <li>{certData.bullet_1}</li>}
                    {certData.bullet_2 && <li>{certData.bullet_2}</li>}
                    {certData.bullet_3 && <li>{certData.bullet_3}</li>}
                  </>
                ) : (
                  <>
                    <li>Recognition at the SICCI Centennial Celebration &amp; Entrepreneur Awards</li>
                    <li>Active engagement with the Singapore business community</li>
                    <li>Affiliations with SICCI, SBF, and the Singapore Logistics Association</li>
                  </>
                )}
              </ul>

              {/* Three logos section */}
              <div
                className="
                  mt-8
                  flex flex-wrap md:flex-nowrap
                  justify-center lg:justify-start
                  gap-4 sm:gap-5 md:gap-6
                "
              >
                {logos.map((src, idx) => (
                  <div
                    key={`logo-${idx}`}
                    className="
                      flex items-center justify-center
                      h-20 w-20
                      sm:h-24 sm:w-24
                      md:h-28 md:w-28
                      lg:h-32 lg:w-32
                      xl:h-36 xl:w-36
                      rounded-full bg-white
                      ring-2 md:ring-4 ring-white
                      border border-slate-200
                      shadow-lg
                      p-1.5 sm:p-2 md:p-2.5
                    "
                    aria-label={`Association logo ${idx + 1}`}
                  >
                    <img
                      src={src}
                      alt={`Association logo ${idx + 1}`}
                      loading="lazy"
                      className="h-full w-full rounded-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationSg;
