import { useEffect, useState } from "react";
import { ClipboardCheck, Package, Truck, CheckCircle } from "lucide-react";
import ScrollAnimation from "./ScrollAnimation";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { getCurrentCountryFromPath } from "@/services/countryDetection";

const defaultSteps = [{
  id: 'def-1',
  title: "Order Processing",
  description: "Recognize your logistic needs and professional consultation",
  icon: 'ClipboardCheck',
}, {
  id: 'def-2',
  title: "Warehousing",
  description: "Secure warehousing for your products before shipping",
  icon: 'Package',
}, {
  id: 'def-3',
  title: "Order Tracking",
  description: "Real-time tracking technology for complete visibility",
  icon: 'Truck',
}, {
  id: 'def-4',
  title: "Product Delivery",
  description: "Timely and secure delivery to your specified destination",
  icon: 'CheckCircle',
}];

const iconMap: Record<string, any> = {
  ClipboardCheck,
  Package,
  Truck,
  CheckCircle
};

const WorkflowSection = () => {
  const [dbSteps, setDbSteps] = useState<any[]>([]);
  const location = useLocation();
  const detected = getCurrentCountryFromPath(location.pathname);
  const countryName = detected?.code === "SG" ? "singapore" : (detected?.name?.toLowerCase() || "singapore");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('homepage_workflow').select('*').eq('country', countryName).eq('is_active', true).order('priority', { ascending: true });
        if (data && data.length > 0) {
            setDbSteps(data);
        } else {
            const { data: sgData } = await supabase.from('homepage_workflow').select('*').eq('country', 'singapore').eq('is_active', true).order('priority', { ascending: true });
            if (sgData && sgData.length > 0) setDbSteps(sgData);
        }
      } catch (err) {
        console.error("Error fetching workflow:", err);
      }
    };
    fetchData();
  }, [countryName]);

  // Guaranteed fallback to old content if DB is empty or missing a title
  const steps = dbSteps.length > 0 && dbSteps[0].title ? dbSteps : defaultSteps;

  if (steps.length === 0) return null;

  return <section className="py-16 bg-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimation className="text-center mb-16">
          <span className="text-kargon-red font-medium text-sm uppercase tracking-wider">OUR PROCESS</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Logistics workflow</h2>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = iconMap[step.icon] || CheckCircle;
            return (
            <ScrollAnimation key={step.id} delay={index * 200} className="text-center">
              <div className="relative mb-6 mx-auto w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center">
                {index > 0 && <div className="absolute right-full top-1/2 w-full h-0.5 bg-gray-200"></div>}
                <IconComponent size={36} className="text-kargon-red" />
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </ScrollAnimation>
          )})}
        </div>
      </div>
    </section>;
};
export default WorkflowSection;