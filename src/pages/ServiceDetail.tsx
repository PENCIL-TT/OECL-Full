import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceDetailData {
  id: string;
  title: string;
  description: string;
  image: string;
  detailed_services?: string;
}

// This function converts our simple markdown to HTML
const processContentToHtml = (content: string) => {
  let html = content || '';
  // 1. Bold: **text** -> <strong>text</strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // 2. Italic: *text* -> <em>text</em>
  html = html.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
  // 3. Links: [text](url) -> <a href="url">text</a>
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-red-600 hover:underline font-medium">$1</a>'
  );
  // 4. Bullet points: - item -> <ul><li>item</li>...</ul>
  const bulletListRegex = /(?:^|\n)((?:- .+(?:\n|$))+)/g;
  html = html.replace(bulletListRegex, (match) => {
    const items = match.trim().split('\n').map(item => {
      const cleanItem = item.replace(/^- /, '').trim();
      return `<li class="flex items-start"><span class="text-red-500 mr-3 mt-1.5">&#8226;</span><span>${cleanItem}</span></li>`;
    }).join('');
    return `<ul class="space-y-2 my-4">${items}</ul>`;
  });
  // 5. Newlines to <br>
  html = html.replace(/\n/g, '<br />');
  // Cleanup extra <br> around lists
  html = html.replace(/<br \/>\s*<ul/g, '<ul');
  html = html.replace(/<\/ul>\s*<br \/>/g, '</ul>');

  return html;
};

const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, title, description, image, detailed_services')
          .eq('slug', slug)
          .single();

        if (error || !data) {
          throw new Error(error?.message || 'Service not found');
        }
        setService(data);
      } catch (err) {
        console.error('Error fetching service detail:', err);
        navigate('/404'); // Redirect to a 404 page if not found
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!service) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Service Not Found</h2>
        <Link to="/services" className="text-red-600 hover:underline mt-4 inline-block">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      <SEO
        title={`${service.title} | OECL Services`}
        description={service.description}
        keywords={`${service.title}, OECL, logistics, supply chain, ${service.slug}`}
      />
      <main className="flex-grow pt-28 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex gap-4 mb-8">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              {isAdmin && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin?tab=services')}
                  className="flex items-center gap-2 hover:bg-slate-100"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              )}
            </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {service.image && (
              <div className="w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-8 shadow-lg">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {service.title}
            </h1>
            
            <div
              className="prose lg:prose-xl max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: processContentToHtml(service.detailed_services || 'No detailed content available for this service.') }}
            />
          </motion.div>
          </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetail;