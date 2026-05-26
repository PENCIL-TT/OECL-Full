import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface CountryData {
  country: string;
  company: string;
  website: string;
  priority: number;
  flag?: string;
}

const countries: CountryData[] = [
  { country: "MALAYSIA", company: "OECL", website: "https://www.oecl.sg/malaysia/home", priority: 3, flag: "/my.svg" },
  { country: "SINGAPORE", company: "GGL", website: "https://ggl.sg/", priority: 1, flag: "/sg.svg" },
  { country: "SINGAPORE", company: "GC", website: "https://www.globalconsol.com/", priority: 2, flag: "/sg.svg" },
  { country: "INDONESIA", company: "OECL", website: "https://www.oecl.sg/indonesia/home", priority: 6, flag: "/id.svg" },
  { country: "THAILAND", company: "OECL", website: "https://www.oecl.sg/thailand/home", priority: 4, flag: "/th.svg" },
  { country: "INDIA", company: "OECL", website: "https://www.oecl.sg/india/home", priority: 4, flag: "/in.svg" },
  { country: "MYANMAR", company: "GC", website: "https://www.globalconsol.com/myanmar/home", priority: 5, flag: "/mm.svg" },
  { country: "AUSTRALIA", company: "GGL Aus", website: "https://www.gglaustralia.com", priority: 7, flag: "/au.svg" },
  { country: "BANGLADESH", company: "GC", website: "https://www.globalconsol.com/bangladesh/home", priority: 9, flag: "/bd.svg" },
  { country: "SRI LANKA", company: "GC", website: "https://www.globalconsol.com/sri-lanka/home", priority: 10, flag: "/lk.svg" },
  { country: "PAKISTAN", company: "GC", website: "https://www.globalconsol.com/pakistan/home", priority: 11, flag: "/pk.svg" },
  { country: "QATAR", company: "ONE GLOBAL", website: "https://oneglobalqatar.com/", priority: 12, flag: "/qa.svg" },
  { country: "SAUDI ARABIA", company: "AMASS", website: "https://amassmiddleeast.com/", priority: 13, flag: "/sa.svg" },
  { country: "UAE", company: "FNL", website: "https://www.futurenetlogistics.com/", priority: 14, flag: "/ae.svg" },
  { country: "USA", company: "GGL", website: "https://gglusa.us/", priority: 15, flag: "/us.svg" },
  { country: "UK", company: "MOLTECH", website: "https://moltech.uk/", priority: 16, flag: "/gb.svg" },
];

const CountrySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCountrySelect = (country: CountryData) => {
    window.open(country.website, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const sortedCountries = [...countries].sort((a, b) => {
    if (a.country === "AUSTRALIA") return -1;
    if (b.country === "AUSTRALIA") return 1;
    return a.priority - b.priority;
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="border-[#F6B100] bg-white text-gray-800 hover:bg-[#F6B100]/10 px-4 py-2 rounded-full flex items-center gap-2"
          >
            <Globe className="w-6 h-6 text-[#F6B100]" />
            <span className="flex items-center gap-1">
              Switch Country <ChevronDown className="h-3 w-3 text-gray-500 ml-1" />
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="center"
          className="w-[280px] border border-amber-100 bg-white p-2 rounded-lg shadow-lg"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <ScrollArea className="h-[300px] w-full pr-2">
            <div className="grid grid-cols-1 gap-1 p-1">
              {sortedCountries.map((country, idx) => (
                <DropdownMenuItem
                  key={`${country.country}-${country.company}-${idx}`}
                  onSelect={(e) => {
                    e.preventDefault(); // prevent default dropdown close
                    handleCountrySelect(country);
                  }}
                  className="cursor-pointer hover:bg-amber-50 p-2 rounded-md flex items-center gap-2 transition-colors"
                >
                  <motion.div whileHover={{ scale: 1.02 }} className="flex items-center w-full">
                    <div className="flex-shrink-0">
                      {country.flag ? (
                        <img
                          src={country.flag}
                          alt={`${country.country} flag`}
                          className="w-6 h-6 rounded-sm shadow-sm object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 rounded-sm flex items-center justify-center">
                          <Globe className="w-4 h-4 text-[#F6B100]" />
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
