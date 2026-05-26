
export interface CountryInfo {
  code: string;
  name: string;
  route: string;
  timezone?: string;
}

const countryMappings: Record<string, CountryInfo> = {
  'IN': { code: 'IN', name: 'India', route: '/india/home' },
  'MY': { code: 'MY', name: 'Malaysia', route: '/malaysia/home' },
  'ID': { code: 'ID', name: 'Indonesia', route: '/indonesia/home' },
  'TH': { code: 'TH', name: 'Thailand', route: '/thailand/home' },
  'SG': { code: 'SG', name: 'Singapore', route: '/' },
};

const timezoneToCountry: Record<string, string> = {
  'Asia/Kolkata': 'IN',
  'Asia/Kuala_Lumpur': 'MY',
  'Asia/Jakarta': 'ID',
  'Asia/Bangkok': 'TH',
  'Asia/Singapore': 'SG',
};

export const detectCountryByTimezone = (): CountryInfo => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const countryCode = timezoneToCountry[timezone] || 'SG';
    return countryMappings[countryCode];
  } catch (error) {
    console.log('Timezone detection failed, defaulting to Singapore');
    return countryMappings['SG'];
  }
};

export const detectCountryByIP = async (): Promise<CountryInfo> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const countryCode = data.country_code;
    
    if (countryMappings[countryCode]) {
      return countryMappings[countryCode];
    }
    
    // Fallback to timezone detection
    return detectCountryByTimezone();
  } catch (error) {
    console.log('IP detection failed, using timezone fallback');
    return detectCountryByTimezone();
  }
};

export const getCurrentCountryFromPath = (pathname: string): CountryInfo => {
  if (pathname.includes('/india')) return countryMappings['IN'];
  if (pathname.includes('/malaysia')) return countryMappings['MY'];
  if (pathname.includes('/indonesia')) return countryMappings['ID'];
  if (pathname.includes('/thailand')) return countryMappings['TH'];
  return countryMappings['SG'];
};
