import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type LocationDetails = {
  map: string;
  address: string;
  phone: string;
  email?: string;
};

type CountryLocations = {
  [location: string]: LocationDetails;
};

type LocationsData = {
  [country: string]: CountryLocations;
};


const LocationsSection: React.FC = () => {
  const { pathname } = useLocation();
  const countryFromPath = pathname.split("/")[1]?.toLowerCase();

  const [locationsData, setLocationsData] = useState<LocationsData>({});
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('office_locations')
          .select('*')
          .eq('is_active', true)
          .order('priority', { ascending: true });
          
        if (data && data.length > 0) {
          const formatted: LocationsData = {};
          data.forEach((loc) => {
            if (!formatted[loc.country]) {
              formatted[loc.country] = {};
            }
            
            // Automatically generate an exact pin map URL using coordinates or address if the admin leaves it blank
            const autoMapUrl = (loc.city_lat && loc.city_lat !== 0) 
              ? `https://maps.google.com/maps?q=${loc.city_lat},${loc.city_lng}&t=&z=14&ie=UTF8&iwloc=&output=embed`
              : `https://maps.google.com/maps?q=${encodeURIComponent((loc.address || loc.city).replace(/\n/g, ' '))}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

            formatted[loc.country][loc.city] = {
              map: loc.map_url || autoMapUrl,
              address: loc.address || '',
              phone: loc.phone || '',
              email: loc.email || ''
            };
          });
          
          setLocationsData(formatted);
          
          const matchedCountry = Object.keys(formatted).find(
            (c) => c.toLowerCase() === countryFromPath
          );
          const defaultCountry = matchedCountry || (formatted["Singapore"] ? "Singapore" : Object.keys(formatted)[0]);
          
          setSelectedCountry(defaultCountry);
          if (formatted[defaultCountry]) {
            setSelectedLocation(Object.keys(formatted[defaultCountry])[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching locations data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, [countryFromPath]);

  if (loading) {
    return <div className="py-16 text-center text-gray-500">Loading global locations...</div>;
  }

  if (Object.keys(locationsData).length === 0) {
    return null;
  }

  const locations = locationsData[selectedCountry] || {};

  // Decide default email
  const getEmail = (country: string, location: string) => {
    const loc = locations[location];
    if (loc?.email) return loc.email; // If specific email set
    if (country === "Indonesia") return "logistics.jkt@oecl.sg";
    return "info@oecl.sg";
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Our Office Locations
        </h2>
        <div className="text-center text-xl font-semibold py-2 px-4 bg-red-600 text-white rounded inline-block">
          {selectedCountry}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-[30%] space-y-3">
          {Object.keys(locations).map((loc) => (
            <button
              key={loc}
              className={`w-full text-left p-3 rounded border transition-all ${
                selectedLocation === loc
                  ? "bg-blue-800 text-white border-blue-800"
                  : "bg-white border-gray-300 hover:bg-blue-100"
              }`}
              onClick={() =>
                setSelectedLocation(loc as keyof CountryLocations)
              }
            >
              {loc}
            </button>
          ))}
        </div>

        <div className="w-full md:w-[70%] space-y-4">
          <div className="bg-slate-100 p-4 rounded border shadow">
            <h3 className="text-xl font-bold mb-2">Address</h3>
            <p className="whitespace-pre-line mb-2">
              {locations[selectedLocation].address}
            </p>
            <h3 className="text-xl font-bold mb-2">Contact</h3>
            <p>{locations[selectedLocation].phone}</p>
            <p>{getEmail(selectedCountry, selectedLocation)}</p>
          </div>

          <div className="relative rounded-lg overflow-hidden h-[400px] shadow-lg">
            <div className="absolute top-0 left-0 w-full text-white text-center py-2 bg-red-600 font-semibold z-10">
              {selectedLocation}
            </div>
            {locations[selectedLocation]?.map ? (
              <iframe
                key={`${selectedCountry}-${selectedLocation}-${locations[selectedLocation].map}`}
                src={locations[selectedLocation].map}
                width="100%"
                height="100%"
                className="absolute top-0 left-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title={`${selectedLocation} Map`}
              ></iframe>
            ) : (
              <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500 pt-10 px-4 text-center">
                <p>Interactive map not configured for this location.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationsSection;
