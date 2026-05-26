import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

const fallbackMeta = {
  title: "OECL",
  description: "OECL - Reliable and efficient logistics solutions tailored to your business needs.",
  ogTitle: "OECL Shipping and Logistics Company in Singapore",
  ogDescription:
    "OECL is a trusted logistics company in Singapore offering comprehensive freight and warehousing solutions. Contact us for efficient logistics services tailored to your needs.",
  ogImage: "https://www.oecl.sg/lovable-uploads/80ac017b-3e55-468b-9c72-9730b97cdcb0.png",
};

type PageSEO = Database["public"]["Tables"]["page_seo"]["Row"];

const normalizePath = (pathname: string) => {
  if (!pathname) return "/";
  const cleaned = pathname.replace(/\/+$/, "");
  return cleaned === "" ? "/" : cleaned;
};

const slugCandidates = (pathname: string) => {
  const normalized = normalizePath(pathname);
  if (normalized === "/") {
    return ["/", "home", "index"];
  }
  const trimmed = normalized.replace(/^\//, "");
  return [normalized, trimmed, trimmed.toLowerCase()];
};

const updateMetaTag = (name: string, content: string | null) => {
  if (!name) return;
  const selector = `meta[name="${name}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!content) {
    if (element) {
      element.setAttribute("content", "");
    }
    return;
  }

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const updatePropertyMetaTag = (property: string, content: string | null) => {
  if (!property) return;
  const selector = `meta[property="${property}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!content) {
    if (element) {
      element.setAttribute("content", "");
    }
    return;
  }

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const applySEO = (entry: PageSEO | null) => {
  const title = entry?.meta_title || fallbackMeta.title;
  if (document.title !== title) {
    document.title = title;
  }

  updateMetaTag("description", entry?.meta_description || fallbackMeta.description);
  updateMetaTag("keywords", entry?.keywords?.join(", ") || "");
  updatePropertyMetaTag("og:title", entry?.og_title || entry?.meta_title || fallbackMeta.ogTitle);
  updatePropertyMetaTag(
    "og:description",
    entry?.og_description || entry?.meta_description || fallbackMeta.ogDescription
  );
  updatePropertyMetaTag("og:image", entry?.og_image || fallbackMeta.ogImage);
};

const SEOManager = () => {
  const location = useLocation();
  const candidates = useMemo(() => slugCandidates(location.pathname), [location.pathname]);

  useEffect(() => {
    let isActive = true;

    const loadSEO = async () => {
      try {
        const { data, error } = await supabase
          .from("page_seo")
          .select("*")
          .in("page_slug", candidates)
          .limit(1);

        if (error) throw error;

        const entry = data && data.length > 0 ? data[0] : null;
        if (isActive) {
          applySEO(entry);
        }
      } catch (error) {
        console.error("Failed to load SEO metadata", error);
        if (isActive) {
          applySEO(null);
        }
      }
    };

    loadSEO();

    return () => {
      isActive = false;
    };
  }, [candidates]);

  return null;
};

export default SEOManager;
