import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Share2, Copy, Facebook, Twitter, Linkedin } from "lucide-react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner";
import { useParams, useNavigate } from 'react-router-dom';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featured_image?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
  alt_text?: string;
  tags?: string[];
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  useEffect(() => {
    if (article) {
      updateMetaTags();
    }
  }, [article]);

  const fetchArticle = async () => {
    if (!slug) {
      navigate('/blog');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('Error fetching article:', error);
        throw error;
      }
      
      if (!data) {
        toast({
          variant: "destructive",
          title: "Article not found",
          description: "The requested article could not be found",
        });
        navigate('/blog');
        return;
      }

      setArticle(data);
    } catch (error: any) {
      console.error('Error in fetchArticle:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load article",
      });
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const updateMetaTags = () => {
    if (!article) return;

    // Update document title
    document.title = article.meta_title || article.title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', article.meta_description || article.excerpt);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = article.meta_description || article.excerpt;
      document.head.appendChild(meta);
    }

    // Update Open Graph tags
    const currentUrl = window.location.href;
    updateMetaTag('property', 'og:title', article.meta_title || article.title);
    updateMetaTag('property', 'og:description', article.meta_description || article.excerpt);
    updateMetaTag('property', 'og:url', currentUrl);
    updateMetaTag('property', 'og:type', 'article');
    if (article.featured_image) {
      updateMetaTag('property', 'og:image', article.featured_image);
      updateMetaTag('property', 'og:image:alt', article.alt_text || article.title);
    }

    // Update Twitter Card tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', article.meta_title || article.title);
    updateMetaTag('name', 'twitter:description', article.meta_description || article.excerpt);
    if (article.featured_image) {
      updateMetaTag('name', 'twitter:image', article.featured_image);
      updateMetaTag('name', 'twitter:image:alt', article.alt_text || article.title);
    }

    // Add article tags as keywords
    if (article.tags && article.tags.length > 0) {
      updateMetaTag('name', 'keywords', article.tags.join(', '));
    }

    // Add article published time
    updateMetaTag('property', 'article:published_time', article.published_at);
    
    // Add article tags
    if (article.tags && article.tags.length > 0) {
      // Remove existing article:tag meta tags
      const existingTags = document.querySelectorAll('meta[property="article:tag"]');
      existingTags.forEach(tag => tag.remove());
      
      // Add new article:tag meta tags
      article.tags.forEach(tag => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'article:tag');
        meta.content = tag;
        document.head.appendChild(meta);
      });
    }
  };

  const updateMetaTag = (attribute: string, name: string, content: string) => {
    let metaTag = document.querySelector(`meta[${attribute}="${name}"]`);
    if (metaTag) {
      metaTag.setAttribute('content', content);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      meta.content = content;
      document.head.appendChild(meta);
    }
  };

  // Enhanced content processing function
  const processContent = (content: string) => {
    let processedContent = content;

    // Process bold text (**text** -> <strong>text</strong>)
    processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Process italic text (*text* -> <em>text</em>)
    processedContent = processedContent.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');

    // Process underlined text (<u>text</u> stays as is)
    // No change needed as it's already HTML

    // Process links ([text](url) -> <a href="url" target="_blank" rel="noopener noreferrer">text</a>)
    processedContent = processedContent.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g, 
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>'
    );

    // Process bullet lists (- item -> <ul><li>item</li></ul>)
    const bulletListRegex = /(?:^|\n)((?:- .+(?:\n|$))+)/gm;
    processedContent = processedContent.replace(bulletListRegex, (match, listItems) => {
      const items = listItems.trim().split('\n').map((item: string) => {
        const cleanItem = item.replace(/^- /, '');
        return `<li class="ml-4">${cleanItem}</li>`;
      }).join('');
      return `<ul class="list-disc pl-6 my-4">${items}</ul>`;
    });

    // Process numbered lists (1. item -> <ol><li>item</li></ol>)
    const numberedListRegex = /(?:^|\n)((?:\d+\. .+(?:\n|$))+)/gm;
    processedContent = processedContent.replace(numberedListRegex, (match, listItems) => {
      const items = listItems.trim().split('\n').map((item: string) => {
        const cleanItem = item.replace(/^\d+\. /, '');
        return `<li class="ml-4">${cleanItem}</li>`;
      }).join('');
      return `<ol class="list-decimal pl-6 my-4">${items}</ol>`;
    });

    // Process line breaks (convert remaining \n to <br />)
    processedContent = processedContent.replace(/\n/g, '<br />');

    // Clean up extra spaces and formatting
    processedContent = processedContent.replace(/<br \/>\s*<(ul|ol)/g, '<$1');
    processedContent = processedContent.replace(/<\/(ul|ol)>\s*<br \/>/g, '</$1>');

    return processedContent;
  };

  const shareUrl = window.location.href;
  const shareTitle = article?.meta_title || article?.title || '';
  const shareDescription = article?.meta_description || article?.excerpt || '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Article link copied to clipboard",
      });
      setShowShareMenu(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy link to clipboard",
      });
    }
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedDescription = encodeURIComponent(shareDescription);

    let shareLink = '';

    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareLink, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card>
              <CardContent className="p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Article not found
                </h1>
                <p className="text-gray-600 mb-6">
                  The article you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => navigate('/blog')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/blog')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {article.featured_image && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img
                    src={article.featured_image}
                    alt={article.alt_text || article.title}
                    className="w-full h-full object-fill"
                  />
                </div>
              )}
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-gray-500">
                    Published on {new Date(article.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    
                    {showShareMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                        <div className="py-1">
                          <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Copy className="h-4 w-4" />
                            Copy Link
                          </button>
                          <button
                            onClick={() => handleShare('facebook')}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Facebook className="h-4 w-4" />
                            Facebook
                          </button>
                          <button
                            onClick={() => handleShare('twitter')}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Twitter className="h-4 w-4" />
                            Twitter
                          </button>
                          <button
                            onClick={() => handleShare('linkedin')}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <h1 className="text-4xl font-bold mb-4 text-gray-900">
                  {article.title}
                </h1>

                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Enhanced content rendering with rich text support */}
                <div className="prose prose-lg max-w-none">
                  <div
                    className="leading-relaxed text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: processContent(article.content)
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetail;
