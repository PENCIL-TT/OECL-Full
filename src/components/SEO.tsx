import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  url: string;
}

const SEO = ({ title, description, keywords, url }: SEOProps) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("keywords", keywords);

    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", url);
  }, [title, description, keywords, url]);

  return null;
};

export default SEO;
