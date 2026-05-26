import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, User, ArrowRight, Edit } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from "@/integrations/supabase/client";
import SEO from '@/components/SEO';
const ScrollToTop = () => {
  const {
    pathname
  } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [pathname]);
  return null;
};
interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featured_image?: string;
  published_at: string;
}
const itemsPerPage = 6;
const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchArticles();
  }, []);
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from('articles').select('*').order('published_at', {
        ascending: false
      });
      if (error) {
        console.error('Error fetching from Supabase:', error);
        setArticles([]);
      } else {
        setArticles(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setArticles([]);
    }
    setLoading(false);
  };
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const currentPosts = articles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  const getImageUrl = (article: Article) => {
    return article.featured_image || "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };
  return <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Navigation />
      <SEO
        title="OECL Logistics Blog | Expert Insights for B2B Supply Chain Solutions"
        description="Explore OECL's logistics blog for B2B-focused articles on warehousing, customs clearance, project cargo, and more. Stay informed with expert insights to optimize your supply chain operations."
        keywords="B2B logistics blog, supply chain insights, warehousing solutions, customs clearance tips, project cargo logistics, OECL Singapore, logistics industry news, freight forwarding updates, supply chain optimization"
        url="https://www.oecl.sg/blogs"
      />
      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Our Blog</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Stay updated with the latest insights, trends, and innovations in global logistics and supply chain management.
          </p>
          
        </div>

        {loading ? <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading articles...</p>
          </div> : articles.length === 0 ? <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No articles published yet.</p>
            <Link to="/blog-editor">

            </Link>
          </div> : <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentPosts.map(article => <Card key={article.id} className="flex flex-col h-full hover:shadow-lg transition-all duration-300 group">
                  <div className="h-48 overflow-hidden rounded-t-lg relative">
                    <img src={getImageUrl(article)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                        Article
                      </span>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        <span>{formatDate(article.published_at)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{getReadTime(article.content)}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="w-4 h-4 mr-2" />
                      <span>OECL Team</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full group" asChild>
                      <Link to={`/blog/${article.slug}`} className="flex items-center justify-center gap-2">
                        Read More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>)}
            </div>

            {totalPages > 1 && <Pagination>
                <PaginationContent>
                  {currentPage > 1 && <PaginationItem>
                      <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                    </PaginationItem>}

                  {[...Array(totalPages)].map((_, i) => <PaginationItem key={i}>
                      <PaginationLink isActive={currentPage === i + 1} onClick={() => handlePageChange(i + 1)}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>)}

                  {currentPage < totalPages && <PaginationItem>
                      <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                    </PaginationItem>}
                </PaginationContent>
              </Pagination>}
          </>}
      </div>
      <Footer />
    </div>;
};
export default Blog;
