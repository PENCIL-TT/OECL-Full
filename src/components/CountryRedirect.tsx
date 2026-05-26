
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { detectCountryByIP, getCurrentCountryFromPath } from '@/services/countryDetection';

const CountryRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCountryRedirect = async () => {
      // Skip redirect if already on a country-specific page
      if (location.pathname.includes('/india') || 
          location.pathname.includes('/malaysia') || 
          location.pathname.includes('/indonesia') || 
          location.pathname.includes('/thailand')) {
        return;
      }

      // Skip redirect for specific pages that should remain global
      const globalPages = ['/login', '/signup', '/blog', '/contact', '/services'];
      if (globalPages.some(page => location.pathname.startsWith(page))) {
        return;
      }

      // Only redirect from root path
      if (location.pathname === '/') {
        try {
          const detectedCountry = await detectCountryByIP();
          if (detectedCountry.route !== '/') {
            navigate(detectedCountry.route, { replace: true });
          }
        } catch (error) {
          console.log('Country detection failed, staying on default page');
        }
      }
    };

    handleCountryRedirect();
  }, [location.pathname, navigate]);

  return null;
};

export default CountryRedirect;
