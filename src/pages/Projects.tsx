import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const projects = [
  {
    id: 1,
    title: "Global E-commerce Supply Chain",
    category: "Supply Chain",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description: "Implemented an end-to-end logistics solution for a global e-commerce platform, handling over 10,000 shipments daily across 15 countries."
  },
  {
    id: 2,
    title: "Pharmaceutical Cold Chain Transport",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description: "Developed a temperature-controlled transportation system for sensitive pharmaceutical products, ensuring compliance with strict regulatory requirements."
  },
  {
    id: 3,
    title: "Automotive Parts Just-in-Time Delivery",
    category: "Manufacturing",
    image: "https://images.unsplash.com/photo-1486611367184-17759508999c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description: "Created a just-in-time delivery system for automotive manufacturers, reducing inventory costs by 30% and improving production efficiency."
  },
  {
    id: 4,
    title: "Agricultural Exports Program",
    category: "Agriculture",
    image: "https://images.unsplash.com/photo-1562837599-d3ff8ef2fee0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description: "Established an export logistics program for agricultural products, connecting farmers with international markets and handling specialized shipping requirements."
  },
  {
    id: 5,
    title: "Retail Distribution Network",
    category: "Retail",
    image: "/lovable-uploads/6fa84550-fe8c-4549-a9c9-c0f071c2cd75.png",
    description: "Optimized the distribution network for a major retail chain, reducing delivery times by 40% and improving customer satisfaction rates."
  },
  {
    id: 6,
    title: "Humanitarian Aid Logistics",
    category: "Non-profit",
    image: "https://images.unsplash.com/photo-1560916338-ab0cdc825906?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description: "Coordinated logistics for humanitarian aid deliveries in crisis-affected regions, overcoming challenging infrastructure and security constraints."
  }
];

const Projects = () => {
  const [projectsList, setProjectsList] = useState<any[]>(projects);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
      if (data && data.length > 0) {
        setProjectsList(data);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="bg-white">
      <Navigation />
      
      <section className="pt-28 pb-16 bg-kargon-blue/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-kargon-dark mb-6">Our Projects</h1>
            <p className="text-lg text-gray-600">
              Discover how our logistics solutions have helped businesses across various industries
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectsList.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <span className="inline-block bg-kargon-blue/10 text-kargon-blue text-sm px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-kargon-dark mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <Button variant="ghost" className="text-kargon-red hover:text-kargon-red/90 hover:bg-transparent p-0 flex items-center gap-1">
                    READ CASE STUDY <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-kargon-blue/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-kargon-dark mb-6">Have a Project in Mind?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Let us help you develop a logistics solution tailored to your specific needs
            </p>
            <Button className="bg-kargon-red hover:bg-kargon-red/90 text-white px-8 py-6 text-lg">
              CONTACT US TODAY
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Projects;
