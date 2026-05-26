
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, NewspaperIcon, Tag } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { newsItems } from '@/data/newsData';

const itemsPerPage = 6;

const NewsOverviewPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Berechne die Gesamtzahl der Seiten
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);
  
  // Filtere die News für die aktuelle Seite
  const currentNewsItems = newsItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Neuigkeiten & Fachartikel</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Informieren Sie sich über unsere neuesten Entwicklungen, 
            Veranstaltungen und Erfolgsgeschichten aus der Welt der 
            digitalen Transformation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentNewsItems.map((news) => (
            <Card key={news.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
              {news.imageUrl && (
                <div className="h-48 overflow-hidden rounded-t-lg relative">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title}
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-gray">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <CardDescription>{news.date}</CardDescription>
                  </div>
                  {news.category && (
                    <span className="text-xs font-medium text-blue bg-blue/10 px-2 py-1 rounded">
                      {news.category}
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl">{news.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-700 line-clamp-3">{news.summary}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2" asChild>
                  <Link to={`/news/${news.id}`}>
                    <NewspaperIcon className="w-4 h-4" />
                    Weiterlesen
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                </PaginationItem>
              )}
              
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    isActive={currentPage === i + 1}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default NewsOverviewPage;
