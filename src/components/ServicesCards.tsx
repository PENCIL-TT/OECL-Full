import ScrollAnimation from "./ScrollAnimation";
import { Clock, ChevronRight } from "lucide-react";
const ServiceCard = ({
  title,
  description,
  icon: Icon,
  delay
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  delay: number;
}) => {
  return <ScrollAnimation delay={delay} className="bg-white shadow-md rounded-lg p-8 flex flex-col h-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-center">
        <div className="rounded-full p-3 bg-kargon-red/10 text-kargon-red mr-3">
          <Icon size={24} />
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>
      <a href="#" className="text-kargon-red font-medium flex items-center hover:underline mt-2">
        SEE MORE
        <ChevronRight size={16} className="ml-1" />
      </a>
    </ScrollAnimation>;
};
const ServicesCards = () => {
  return null;
};
export default ServicesCards;