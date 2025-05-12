import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  canonical?: string;
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  ogImage,
  ogType = 'website',
  canonical,
  noIndex = false,
}: SEOProps): Metadata {
  // Base URL for canonical links and OG images
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://digitalspeed.com';
  
  // Default OG image
  const defaultOgImage = `${baseUrl}/og-image.jpg`;
  
  return {
    title,
    description,
    keywords: keywords.join(', '),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonical ? canonical : undefined,
    },
    openGraph: {
      title,
      description,
      type: ogType,
      url: canonical ? canonical : undefined,
      images: [
        {
          url: ogImage || defaultOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage || defaultOgImage],
    },
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
  };
}

// Schema.org structured data for different content types
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: article.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'DigitalSpeed',
      logo: {
        '@type': 'ImageObject',
        url: 'https://digitalspeed.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  url: string;
  sku?: string;
  brand?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  reviewCount?: number;
  ratingValue?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'DigitalSpeed',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      url: product.url,
    },
    ...(product.reviewCount && product.ratingValue
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.ratingValue,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };
}

export function generateOrganizationSchema(org: {
  name: string;
  logo: string;
  url: string;
  description: string;
  socialProfiles?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    logo: org.logo,
    url: org.url,
    description: org.description,
    sameAs: org.socialProfiles || [],
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
