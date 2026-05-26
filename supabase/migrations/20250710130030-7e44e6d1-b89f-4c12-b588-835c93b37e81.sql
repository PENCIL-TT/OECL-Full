
-- Create a table for blog articles
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT UNIQUE NOT NULL,
  featured_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for better performance
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_published_at ON public.articles(published_at DESC);

-- Add Row Level Security (RLS) - make articles publicly readable
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to read articles
CREATE POLICY "Anyone can read articles" 
  ON public.articles 
  FOR SELECT 
  USING (true);

-- Create policy that allows only authenticated users to insert articles
CREATE POLICY "Authenticated users can create articles" 
  ON public.articles 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy that allows only authenticated users to update articles
CREATE POLICY "Authenticated users can update articles" 
  ON public.articles 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Create policy that allows only authenticated users to delete articles
CREATE POLICY "Authenticated users can delete articles" 
  ON public.articles 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);
