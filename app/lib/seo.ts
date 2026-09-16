import type { Metadata } from "next";

export const SITE_URL = "https://imponix.com";
export const YOUTUBE_URL = "https://www.youtube.com/@Imponix";
export const TIKTOK_URL = "https://www.tiktok.com/@imponixgames";
export const X_URL = "https://www.x.com/imponixgames";

type PageMetadataOptions = {
  description: string;
  image?: string;
  imageAlt?: string;
  path: string;
  publishedTime?: string;
  modifiedTime?: string;
  title: string;
  type?: "article" | "website";
};

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function createPageMetadata({
  description,
  image = "/og.png",
  imageAlt = "Imponix Game Studio — two friends, worlds worth remembering",
  path,
  publishedTime,
  modifiedTime,
  title,
  type = "website",
}: PageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? {
          type: "article",
          siteName: "Imponix Game Studio",
          locale: "en_CA",
          title,
          description,
          url: canonical,
          publishedTime,
          modifiedTime,
          authors: ["Imponix Game Studio"],
          images: [{ url: imageUrl, alt: imageAlt }],
        }
      : {
          type: "website",
          siteName: "Imponix Game Studio",
          locale: "en_CA",
          title,
          description,
          url: canonical,
          images: [{ url: imageUrl, alt: imageAlt }],
        };

  return {
    title,
    description,
    alternates: { canonical },
    openGraph,
    twitter: {
      card: "summary_large_image",
      site: "@imponixgames",
      creator: "@imponixgames",
      title,
      description,
      images: [imageUrl],
    },
  };
}

const organizationEntity = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Imponix Game Studio",
  alternateName: "Imponix",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/brand/imponix-logo.png"),
    width: 941,
    height: 244,
  },
  image: absoluteUrl("/og.png"),
  email: "contact@imponix.com",
  description:
    "A two-person independent game studio working between Montréal, Québec, Canada, and Fortaleza, Ceará, Brazil.",
  sameAs: [X_URL, YOUTUBE_URL, TIKTOK_URL],
};

export const organizationJsonLd = {
  "@context": "https://schema.org",
  ...organizationEntity,
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Imponix Game Studio",
  alternateName: "Imponix",
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en",
};

type GameJsonLdOptions = {
  datePublished?: string;
  description: string;
  genre: string[];
  image: string;
  name: string;
  operatingSystem?: string | string[];
  path: string;
  sameAs?: string[];
};

export function createGameJsonLd({
  datePublished,
  description,
  genre,
  image,
  name,
  operatingSystem = "Windows",
  path,
  sameAs = [],
}: GameJsonLdOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "@id": `${absoluteUrl(path)}#game`,
    name,
    url: absoluteUrl(path),
    description,
    image: absoluteUrl(image),
    genre,
    gamePlatform: "PC",
    operatingSystem,
    playMode: "SinglePlayer",
    applicationCategory: "Game",
    inLanguage: "en",
    datePublished,
    publisher: organizationEntity,
    author: organizationEntity,
    sameAs,
  };
}

type ArticleJsonLdOptions = {
  dateModified?: string;
  datePublished: string;
  description: string;
  headline: string;
  image: string;
  path: string;
  schemaType?: "BlogPosting" | "NewsArticle";
};

export function createArticleJsonLd({
  dateModified,
  datePublished,
  description,
  headline,
  image,
  path,
  schemaType = "BlogPosting",
}: ArticleJsonLdOptions) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": `${url}#article`,
    headline,
    description,
    image: absoluteUrl(image),
    datePublished,
    dateModified: dateModified ?? datePublished,
    mainEntityOfPage: url,
    author: organizationEntity,
    publisher: organizationEntity,
    inLanguage: "en",
  };
}

export function createBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
