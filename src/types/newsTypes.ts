export type NewsItem = {
  id: number;
  slug: string; // Added slug for cleaner URLs
  title: string;
  date: string;
  summary: string;
  imageUrl?: string;
  content?: string;
  category?: string;
};
