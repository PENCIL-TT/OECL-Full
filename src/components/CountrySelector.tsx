import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

interface CountryData {
  country: string;
  company: string;
  website: string;
  priority: number;
  flag?: string;
  route?: string;
  slug?: string;
}

const defaultCountries: CountryData[] = [
  { country: "SINGAPORE", company: "OECL", website: "https://www.oecl.sg/home", priority: 1, flag: "/sg.svg", slug: "" },
  { country: "MALAYSIA", company: "OECL", website: "https://www.oecl.sg/malaysia/home", priority: 2, flag: "/my.svg", slug: "malaysia" },
  { country: "INDONESIA", company: "OECL", website: "https://www.oecl.sg/indonesia/home", priority: 3, flag: "/id.svg", slug: "indonesia" },
  { country: "THAILAND", company: "OECL", website: "https://www.oecl.sg/thailand/home", priority: 4, flag: "/th.svg", slug: "thailand" },
  { country: "MYANMAR", company: "GC", website: "https://www.globalconsol.com/myanmar/home", priority: 5, flag: "/mm.svg", slug: "myanmar" },
  { country: "CHINA", company: "Haixun", website: "https://www.haixun.co/", priority: 6, flag: "/cn.svg", slug: "china" },
  { country: "AUSTRALIA", company: "GGL", website: "https://www.gglaustralia.com/", priority: 7, flag: "/au.svg", slug: "australia" },
  { country: "INDIA", company: "OECL", website: "https://www.oecl.sg/india/home", priority: 8, flag: "/in.svg", slug: "india" },
  { country: "SRI LANKA", company: "GC", website: "https://www.globalconsol.com/sri-lanka/home", priority: 9, flag: "/lk.svg", slug: "sri-lanka" },
  { country: "PAKISTAN", company: "GC", website: "https://www.globalconsol.com/pakistan/home", priority: 10, flag: "/pk.svg", slug: "pakistan" },
  { country: "QATAR", company: "ONE GLOBAL", website: "https://oneglobalqatar.com/", priority: 11, flag: "/qa.svg", slug: "qatar" },
  { country: "SAUDI ARABIA", company: "AMASS", website: "https://amassmiddleeast.com/", priority: 12, flag: "/sa.svg", slug: "saudi-arabia" },
  { country: "UAE", company: "FNL", website: "https://www.futurenetlogistics.com/", priority: 13, flag: "/ae.svg", slug: "uae" },
  { country: "USA", company: "GGL", website: "https://gglusa.us/", priority: 14, flag: "/us.svg", slug: "usa" },
  { country: "UK", company: "GGL", website: "https://www.ggl.sg/uk", priority: 16, flag: "/gb.svg" }
];

const CountrySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [countries, setCountries] = useState<CountryData[]>(defaultCountries);

  const pathname = location.pathname;
  const slug = pathname.split("/")[1]?.toLowerCase() || "";

  // Find the country by slug, fallback to Singapore
  const displayCountry =
    countries.find((c) => c.slug?.toLowerCase() === slug) ||
    countries.find((c) => c.country.toUpperCase() === "SINGAPORE");

  const availableCountries = countries.filter((country) => {
    const current = displayCountry?.country.toUpperCase();
    if (current === "INDIA" && country.country.toUpperCase() === "PAKISTAN") return false;
    return country.country.toUpperCase() !== current;
  });

  const sortedCountries = [...availableCountries].sort((a, b) => a.priority - b.priority);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data, error } = await supabase
          .from('countries')
          .select('*')
          .eq('is_active', true)
          .order('priority', { ascending: true });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const mappedCountries: CountryData[] = data.map(c => ({
            country: c.name,
            company: c.company,
            website: c.website,
            priority: c.priority,
            flag: c.flag,
            slug: c.slug || ""
          }));
          setCountries(mappedCountries);
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };
    fetchCountries();
  }, []);

  const handleCountrySelect = (country: CountryData) => {
    const currentPath = location.pathname;
    const internalSlugs = ["", "malaysia", "indonesia", "thailand", "india"];
    const localizedRoutes = ["services", "about-us", "global-presence", "blogs", "contact", "gallery", "home"];

    const targetSlug = country.slug || "";
    const isTargetInternal = internalSlugs.includes(targetSlug);

    if (isTargetInternal) {
      const pathSegments = currentPath.split('/').filter(Boolean);
      const firstSegment = pathSegments[0]?.toLowerCase();
      const currentSlug = internalSlugs.includes(firstSegment) && firstSegment !== "" ? firstSegment : "";

      let pagePathSegments = currentSlug ? pathSegments.slice(1) : pathSegments;
      
      // Handle /blog -> /blogs normalization
      if (pagePathSegments.length === 1 && pagePathSegments[0] === "blog") {
        pagePathSegments[0] = "blogs";
      }

      const firstPageSegment = pagePathSegments[0]?.toLowerCase();
      const isLocalized = localizedRoutes.includes(firstPageSegment) || pagePathSegments.length === 0;

      let newPath = "";

      if (isLocalized) {
        const pagePath = pagePathSegments.join("/");
        if (targetSlug === "") {
          newPath = "/" + pagePath;
        } else {
          newPath = "/" + targetSlug + (pagePath ? "/" + pagePath : "");
        }
      } else {
        // Fallback to home page of target country if current page is not localized
        newPath = targetSlug === "" ? "/" : "/" + targetSlug;
      }

      newPath = newPath.replace(/\/+/g, '/');
      if (newPath === "") newPath = "/";
      
      navigate(newPath + location.search + location.hash);
    } else {
      window.open(country.website, '_blank', 'noopener,noreferrer');
    }

    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative z-50 flex items-center gap-2">
      {/* Show current flag */}
      {displayCountry?.flag && (
        <img
          src={displayCountry.flag}
          alt={`${displayCountry.country} flag`}
          className="w-6 h-6 rounded shadow-sm object-cover"
          title={displayCountry.country}
        />
      )}

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-black text-white border-black hover:bg-white hover:text-black px-4 py-2 rounded-full flex items-center gap-2 group"
          >
            <Globe className="w-6 h-6 text-white group-hover:text-black" />
            <span className="flex items-center gap-1">
              Switch Country <ChevronDown className="h-3 w-3 ml-1 text-white group-hover:text-black" />
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="center"
          className="w-[280px] max-h-screen h-[90vh] border border-amber-100 bg-white p-2 rounded-lg shadow-lg overflow-y-auto"
        >
          <ScrollArea className="h-full w-full pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 gap-1 p-1">
              {sortedCountries.map((country) => (
                <DropdownMenuItem
                  key={country.country}
                  onSelect={(e) => {
                    e.preventDefault();
                    handleCountrySelect(country);
                  }}
                  className="cursor-pointer hover:bg-amber-50 py-4 px-3 min-h-[60px] rounded-md flex items-center gap-3 transition-all"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center w-full"
                  >
                    <div className="flex-shrink-0">
                      {country.flag ? (
                        <img
                          src={country.flag}
                          alt={`${country.country} flag`}
                          className="w-6 h-6 rounded-sm shadow-sm object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 rounded-sm flex items-center justify-center">
                          <Globe className="w-6 h-6 text-[#F6B100]" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-sm">{country.country}</div>
                      <div className="text-xs text-gray-500">{country.company}</div>
                    </div>
                  </motion.div>
                </DropdownMenuItem>
              ))}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CountrySelector;
