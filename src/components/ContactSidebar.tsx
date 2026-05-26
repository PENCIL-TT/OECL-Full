import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  X, MapPin, Globe, ExternalLink, Phone, Mail, Home, ChevronRight, Printer
} from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from "@/integrations/supabase/client";
import { getCurrentCountryFromPath } from "@/services/countryDetection";

interface ContactSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CityData {
  name: string;
  lat: number;
  lng: number;
  address: string;
  contacts: string[];
  email?: string;
  fax?: string;
  map_url?: string;
  priority: number;
}

interface CountryData {
  code: string;
  name: string;
  lat: number;
  lng: number;
  priority: number;
  cities: CityData[];
}

const ContactSidebar: React.FC<ContactSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const isIndiaPage = location.pathname.startsWith("/india"); // detect if user is on /in path
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [selectedCityIndexes, setSelectedCityIndexes] = useState<{ [countryName: string]: number }>({});
  const isMobile = useIsMobile();
  const [dbCountries, setDbCountries] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapBaseUrl, setMapBaseUrl] = useState("https://www.google.com/maps/d/u/0/embed?mid=1rF5337I7j7xk98at6ZPdMul4aglzrLg&ehbc&ehbc=2E312F&hl=en&output=embed"); // Fallback

  const detected = getCurrentCountryFromPath(location.pathname);
  const countryName = detected?.code === "SG" ? "singapore" : (detected?.name?.toLowerCase() || "singapore");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('office_locations_global')
          .select('*')
          .eq('is_active', true)
          .order('priority', { ascending: true });
          
        if (data && data.length > 0) {
          const grouped = data.reduce((acc: any, curr: any) => {
            if (!acc[curr.country]) {
              acc[curr.country] = {
                name: curr.country,
                code: curr.country_code,
                lat: Number(curr.country_lat) || 0,
                lng: Number(curr.country_lng) || 0,
                priority: curr.priority || 999,
                cities: []
              };
            } else {
              if (curr.priority < acc[curr.country].priority) {
                acc[curr.country].priority = curr.priority;
              }
            }
            acc[curr.country].cities.push({
              name: curr.city,
              lat: Number(curr.city_lat) || 0,
              lng: Number(curr.city_lng) || 0,
              address: curr.address,
              contacts: curr.phone ? curr.phone.split(',').map((s: string) => s.trim()) : [],
              email: curr.email,
              fax: curr.fax,
              map_url: curr.map_url,
              priority: curr.priority || 999
            });
            return acc;
          }, {});
          
          const groupedValues = Object.values(grouped).map((country: any) => ({
            ...country,
            cities: country.cities.sort((a: any, b: any) => a.priority - b.priority)
          }));
          
          setDbCountries(groupedValues as CountryData[]);

          // Fetch the base map URL
          const { data: contentData } = await supabase
            .from('contact_page_content')
            .select('global_map_url')
            .eq('country', countryName)
            .maybeSingle();

          if (contentData && contentData.global_map_url && contentData.global_map_url.startsWith('http')) {
            setMapBaseUrl(contentData.global_map_url);
          } else {
            const { data: sgData } = await supabase.from('contact_page_content').select('global_map_url').eq('country', 'singapore').maybeSingle();
            if (sgData && sgData.global_map_url && sgData.global_map_url.startsWith('http')) {
              setMapBaseUrl(sgData.global_map_url);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [countryName]);

  const sortedCountries = [...dbCountries]
    .sort((a, b) => (a.priority || 999) - (b.priority || 999) || String(a.name || "").localeCompare(String(b.name || "")));

  useEffect(() => {
    iframeRef.current = document.querySelector('iframe');
  }, []);

  useEffect(() => {
    if (!loading && dbCountries.length > 0 && sortedCountries.length > 0 && sortedCountries[0].cities.length > 0) {
      const firstCountry = sortedCountries[0];
      const firstCity = firstCountry.cities[0];
      setSelectedLocation(firstCity);
      setExpandedCountry(firstCountry.name);

      const initialIndexes: { [countryName: string]: number } = {};
      sortedCountries.forEach(country => {
        initialIndexes[country.name] = 0;
      });
      setSelectedCityIndexes(initialIndexes);
      navigateToLocation(firstCity.lat, firstCity.lng, firstCity);
    }
  }, [loading, dbCountries.length]);

  const navigateToLocation = (lat: number, lng: number, city: any = null) => {
    const iframe = document.querySelector('iframe[title="Interactive Map"]') as HTMLIFrameElement;
    if (iframe) {
      if (city && city.map_url && city.map_url.includes('google.com/maps')) {
        iframe.src = city.map_url;
        if (city) setSelectedLocation(city);
        return;
      }
      
      if (mapBaseUrl && mapBaseUrl.startsWith('http') && mapBaseUrl.includes('embed')) {
        try {
          const zoomLevel = city ? 12 : 9;
          
          const urlObj = new URL(mapBaseUrl);
          urlObj.searchParams.set('z', zoomLevel.toString());
          urlObj.searchParams.set('ll', `${lat},${lng}`);
          urlObj.searchParams.set('hl', 'en');
          urlObj.searchParams.set('ehbc', '2E312F');
          
          iframe.src = urlObj.toString();
          if (city) setSelectedLocation(city);
        } catch (e) {
          console.error("Navigation failed:", e);
        }
      }
    }
  };

  const handleCitySelection = (country: any, cityIndex: number) => {
    setSelectedCityIndexes(prev => ({ ...prev, [country.name]: cityIndex }));
    const selectedCity = country.cities[cityIndex];
    navigateToLocation(selectedCity.lat, selectedCity.lng, selectedCity);
  };

  const isSelectedCity = (countryName: string, cityIndex: number) =>
    selectedCityIndexes[countryName] === cityIndex;

  // ... [REMAINS SAME: Render JSX sidebar and Accordion UI below as in your current code] ...

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300" 
          onClick={onClose} 
        />
      )}
      
      {/* Sidebar container */}
      <div className={`my-3 w-full ${isMobile ? 'max-w-[95%]' : 'max-w-[520px]'} mx-auto px-2 md:px-0`}>
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-xl shadow-sm">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <h2 className="font-bold text-lg">Global Locations</h2>
          </div>
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-red-500/20">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Content area */}
        <ScrollArea className={`h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] bg-white rounded-b-xl shadow-md`}>
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : sortedCountries.length === 0 ? (
              <div className="text-center py-8 text-gray-500 font-medium">No locations available yet.</div>
            ) : (
              <div className="mt-4 space-y-3">
              <Accordion 
                type="single" 
                collapsible 
                value={expandedCountry || ""} 
                onValueChange={(val) => {
                  setExpandedCountry(val || null);
                  if (val) {
                    const selectedC = sortedCountries.find(c => c.name === val);
                    if (selectedC) navigateToLocation(selectedC.lat, selectedC.lng);
                  }
                }}
                className="w-full space-y-3"
              >
                {sortedCountries.map(country => {
                  return (
                    <AccordionItem 
                      key={country.name} 
                      value={country.name} 
                      className="border border-red-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all bg-white"
                    >
                      <AccordionTrigger className="rounded-t-md hover:bg-amber-50 transition-colors px-3 py-2">
                        <div className="flex items-center gap-3">
                          <img 
                            src={`/${country.code}.svg`} 
                            alt={`${country.name} flag`} 
                            className="w-6 h-6 rounded-sm object-cover shadow-sm" 
                          />
                          <span className="font-medium">{country.name}</span>
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="bg-gradient-to-b from-red-50/30 to-white px-3 py-2">
                        <div className="space-y-2">
                          {/* All cities displayed as buttons */}
                          <div className="space-y-2">
                            {country.cities.map((city: any, index: number) => (
                              <div key={index} className="w-full">
                                <Button 
                                  variant="ghost" 
                                  className={cn(
                                    "w-full justify-start text-sm p-2 h-auto rounded-md border transition-all shadow-sm",
                                    isSelectedCity(country.name, index) 
                                      ? "bg-red-100 hover:bg-red-150 border-red-300 text-red-800" 
                                      : "bg-white hover:bg-red-50 border-gray-100 hover:border-red-200"
                                  )}
                                  onClick={() => {
                                    handleCitySelection(country, index);
                                    if (isMobile) {
                                      setTimeout(() => setSelectedLocation({ ...city }), 50);
                                    }
                                  }}
                                >
                                  <MapPin className="w-4 h-4 mr-2 text-red-600 flex-shrink-0" />
                                  <span className="font-medium truncate">{city.name}</span>
                                  <ChevronRight className="w-4 h-4 ml-auto text-red-300" />
                                </Button>
                                
                                {/* Show address details for selected city */}
                                {isSelectedCity(country.name, index) && city.address && (
                                  <div className="mt-2 p-3 bg-gradient-to-br from-red-50 to-white rounded-lg border border-red-200 shadow text-sm animate-in fade-in duration-300 w-full">
                                    <h4 className="font-semibold text-red-700 mb-2 pb-1 border-b border-red-100 flex items-center">
                                      <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">{city.name} Office</span>
                                    </h4>
                                    
                                    <div className="flex items-start mb-2 group hover:bg-red-50/50 p-2 rounded-md transition-colors w-full">
                                      <Home className="w-4 h-4 mr-2 text-red-500 mt-1 flex-shrink-0 group-hover:text-red-600 transition-colors" />
                                      <p className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm break-words w-full overflow-hidden">{city.address}</p>
                                    </div>
                                    
                                    {city.contacts && city.contacts.length > 0 && (
                                      <div className="flex items-start mb-2 group hover:bg-red-50/50 p-2 rounded-md transition-colors w-full">
                                        <Phone className="w-4 h-4 mr-2 text-red-500 mt-1 flex-shrink-0 group-hover:text-red-600 transition-colors" />
                                        <div className="space-y-1 w-full overflow-hidden">
                                          {city.contacts.map((contact: string, idx: number) => (
                                            <p key={idx} className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm break-words">{contact}</p>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {city.fax && (
                                      <div className="flex items-start mb-2 group hover:bg-red-50/50 p-2 rounded-md transition-colors w-full">
                                        <Printer className="w-4 h-4 mr-2 text-red-500 mt-1 flex-shrink-0 group-hover:text-red-600 transition-colors" />
                                        <p className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm break-words w-full overflow-hidden">Fax: {city.fax}</p>
                                      </div>
                                    )}

                                    {city.email && (
                                      <div className="flex items-start group hover:bg-red-50/50 p-2 rounded-md transition-colors w-full">
                                        <Mail className="w-4 h-4 mr-2 text-red-500 mt-1 flex-shrink-0 group-hover:text-red-600 transition-colors" />
                                        <a 
                                          href={`mailto:${city.email}`} 
                                          className="text-red-600 hover:text-red-800 hover:underline flex items-center text-sm break-words w-full overflow-hidden"
                                        >
                                          {city.email}
                                          <ExternalLink className="ml-1 h-3 w-3" />
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default ContactSidebar;
