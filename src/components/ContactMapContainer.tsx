import React, { useState, useEffect } from 'react';
import { RefreshCw, Maximize2, Minimize2, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { getCurrentCountryFromPath } from "@/services/countryDetection";

const FALLBACK_MAP_URL = "https://www.google.com/maps/d/u/0/embed?mid=1rF5337I7j7xk98at6ZPdMul4aglzrLg&ehbc&ehbc=2E312F&hl=en&output=embed";

const ContactMapContainer = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mapUrl, setMapUrl] = useState(FALLBACK_MAP_URL);
  const [mapKey, setMapKey] = useState(0);
  
  const location = useLocation();
  const detected = getCurrentCountryFromPath(location.pathname);
  const countryName = detected?.code === "SG" ? "singapore" : (detected?.name?.toLowerCase() || "singapore");

  useEffect(() => {
    const fetchMapUrl = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_page_content')
          .select('global_map_url')
          .eq('country', countryName)
          .maybeSingle();

        if (data && data.global_map_url && data.global_map_url.startsWith('http')) {
          setMapUrl(data.global_map_url);
        } else {
          const { data: sgData } = await supabase.from('contact_page_content').select('global_map_url').eq('country', 'singapore').maybeSingle();
          if (sgData && sgData.global_map_url && sgData.global_map_url.startsWith('http')) {
            setMapUrl(sgData.global_map_url);
          }
        }
      } catch (error) {
        console.error("Failed to fetch global map URL, using fallback.", error);
      }
    };
    fetchMapUrl();
  }, [countryName]);

  const handleReload = () => {
    setIsLoaded(false);
    setMapKey(prev => prev + 1); // Safe reload without manipulating DOM directly
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden relative w-full transition-all duration-300 ease-in-out ${isFullScreen ? 'max-w-full' : 'max-w-6xl'} my-3`}>
        {/* Map Header */}
        <div className="flex justify-between items-center p-3 border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
          <h3 className="font-medium text-red-700 flex items-center">
            <span className="hidden sm:inline">Interactive Global Presence Map</span>
            <span className="sm:hidden">Global Map</span>
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReload} className="text-red-600 border-red-200 hover:bg-red-50">
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullScreen} className="text-red-600 border-red-200 hover:bg-red-50">
              {isFullScreen ? <span className="flex items-center">
                  <Minimize2 className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden sm:inline">Compact</span>
                </span> : <span className="flex items-center">
                  <Maximize2 className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden sm:inline">Expand</span>
                </span>}
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className={`relative transition-all duration-300 ${isFullScreen ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
          {/* Mask the top black Google bar */}
          <div className="absolute top-0 left-0 w-full h-[50px] bg-white z-10 pointer-events-none" />
          
          {mapUrl && mapUrl.startsWith('http') && mapUrl.includes('embed') ? (
            <iframe 
              key={`${mapUrl}-${mapKey}`}
              src={mapUrl} 
              title="Interactive Map" 
              className="w-full h-full border-0" 
              loading="eager" 
              style={{
                marginTop: '-125px',
                backgroundColor: 'transparent',
                filter: 'contrast(1.05) saturate(1.1)'
              }} 
              onLoad={() => setIsLoaded(true)}
            ></iframe>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500">
              <MapPin className="w-10 h-10 mb-2 opacity-50" />
              <p className="font-semibold text-lg text-slate-700">Invalid or Missing Map Link</p>
              <p className="max-w-md mt-2 text-center text-sm px-4">The map URL configured for this location is not an embeddable link. Please update the URL in the Admin Panel using the "Embed a map" option from Google Maps.</p>
            </div>
          )}
          
          {/* Loading Spinner */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
                <p className="mt-3 text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Map Footer */}
        <div className="py-2 px-4 border-t border-red-100 bg-gradient-to-r from-white to-red-50 text-xs text-gray-500 text-center">
          <p>© 2025 OECL Global Presence Map | Data updated quarterly</p>
        </div>
      </div>
    </div>
  );
};

export default ContactMapContainer;
