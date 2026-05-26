import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { newsItems } from '@/data/newsData';
import { NewsItem } from '@/types/newsTypes';

const NewsDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const item = newsItems.find(news => news.slug === slug);
      setNewsItem(item || null);
    }
    setLoading(false);
  }, [slug]);

  const renderContent = () => {
    if (!newsItem || !newsItem.content) return null;

    if (newsItem.id.toString() !== '3') {
      return <div className="whitespace-pre-line">{newsItem.content}</div>;
    }

    const processedSections = new Set<string>();
    const sections = [
      {
        title: "Kundenservice & Support",
        icon: "https://github.com/stone1971grey/projekt-bilder/blob/ccds_web/E-Commerce_Produktberatung--293x300.png?raw=true"
      },
      {
        title: "Interne Assistenz für HR & IT",
        icon: "https://github.com/stone1971grey/projekt-bilder/blob/ccds_web/Bildung-Weiterbildung-293x300.png?raw=true"
      },
      {
        title: "E-Commerce & Produktberatung",
        icon: "https://github.com/stone1971grey/projekt-bilder/blob/ccds_web/E-Commerce_Produktberatung--293x300.png?raw=true"
      },
      {
        title: "Finanzdienstleistungen & Versicherungen",
        icon: "https://github.com/stone1971grey/projekt-bilder/blob/ccds_web/Finanzdienstleistungen-Versicherungen-293x300.png?raw=true"
      },
      {
        title: "Behörden & öffentliche Verwaltung",
        icon: "https://github.com/stone1971grey/projekt-bilder/blob/ccds_web/Behoerden-oeffentliche-Verwaltungen-293x300.png?raw=true"
      },
      {
        title: "Bildung & Weiterbildung",
        icon: "https://github.com/stone1971grey/projekt-bilder/blob/ccds_web/Bildung-Weiterbildung-293x300.png?raw=true"
      }
    ];

    const lines = newsItem.content.split('\n');
    const processedLines = lines.map((line, index) => {
      for (const section of sections) {
        if (line.includes(section.title) && !processedSections.has(section.title)) {
          processedSections.add(section.title);
          return (
            <div key={`${section.title}-${index}`} className="flex items-center mt-6 mb-2">
              <img src={section.icon} alt={section.title} className="w-12 h-12 mr-3 object-contain" />
              <h3 className="text-xl font-bold">{section.title}</h3>
            </div>
          );
        }
      }
      return <p key={index} className="mb-4">{line}</p>;
    });

    return <div>{processedLines}</div>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Lade Artikel...</p>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Artikel nicht gefunden</h1>
        <Button asChild variant="outline">
          <Link to="/blog">Go Back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-[158px]">
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-8">
            <Link to="/blog" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Link>
          </Button>
        </div>

        {newsItem.imageUrl && (
          <div className="w-full bg-white rounded-lg mb-8 p-4 flex justify-center items-center max-h-[400px]">
            <img
              src={newsItem.imageUrl}
              alt={newsItem.title}
              className="max-w-full max-h-[400px] object-contain"
              loading="lazy"
            />
          </div>
        )}

        <Card className="mb-8 shadow-lg border border-gray-200 bg-white rounded-xl p-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl md:text-4xl font-bold">{newsItem.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{newsItem.date}</span>
              </div>
              {newsItem.category && (
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  <span className="text-blue bg-blue/10 px-2 py-1 rounded text-xs font-medium">
                    {newsItem.category}
                  </span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800 leading-relaxed">
              {newsItem.content ? renderContent() : <p>{newsItem.summary}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default NewsDetailPage;
