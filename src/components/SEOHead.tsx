import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
  availability?: string;
  category?: string;
  brand?: string;
  sku?: string;
  lang?: 'en' | 'bn';
  structuredData?: object;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  price,
  currency = 'BDT',
  availability = 'https://schema.org/InStock',
  category,
  brand = 'Rukhi Bangladesh',
  sku,
  lang = 'en',
  structuredData,
}) => {
  const defaultTitle = lang === 'en' 
    ? 'Rukhi - Streetwear & Fashion Online Store Bangladesh' 
    : 'রুখি - স্ট্রিটওয়্যার ও ফ্যাশন অনলাইন শপ বাংলাদেশ';

  const siteTitle = title 
    ? (title.includes('Rukhi') ? title : `${title} | Rukhi Bangladesh`)
    : defaultTitle;

  const defaultDescription = lang === 'en'
    ? 'Bangladesh-based streetwear and fashion online store with 100% Cash-on-Delivery. Premium heavyweight hoodies, graphic tees, denim, and streetwear accessories with doorstep inspection.'
    : 'ক্যাশ অন ডেলিভারিতে বাংলাদেশের প্রিমিয়াম স্ট্রিটওয়্যার এবং ফ্যাশন অনলাইন শপ। হেভিওয়েট হুডি, গ্রাফিক টি-শার্ট এবং ডেনিম ড্রপ।';

  const metaDescription = description || defaultDescription;

  const defaultKeywords = 'Rukhi Bangladesh, Rukhi streetwear, hoodies Bangladesh, graphic tee Dhaka, oversized t shirt BD, streetwear online shop Dhaka, cash on delivery fashion BD';
  const metaKeywords = keywords || defaultKeywords;

  const defaultImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200';
  const metaImage = image || defaultImage;

  const metaUrl = url || (typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://rukhibd.com');
  const locale = lang === 'bn' ? 'bn_BD' : 'en_BD';

  // Construct JSON-LD Schema.org structured data
  const jsonLdData = structuredData || (
    type === 'product' && price !== undefined
      ? {
          '@context': 'https://schema.org/',
          '@type': 'Product',
          name: title || 'Rukhi Streetwear Product',
          image: [metaImage],
          description: metaDescription,
          sku: sku || `RUKHI-${Math.floor(Math.random() * 10000)}`,
          brand: {
            '@type': 'Brand',
            name: brand,
          },
          category: category || 'Fashion & Apparel',
          offers: {
            '@type': 'Offer',
            url: metaUrl,
            priceCurrency: currency,
            price: price,
            availability: availability,
            itemCondition: 'https://schema.org/NewCondition',
            seller: {
              '@type': 'Organization',
              name: 'Rukhi Bangladesh',
            },
          },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'OnlineStore',
          name: 'Rukhi Bangladesh',
          url: metaUrl,
          logo: metaImage,
          description: metaDescription,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Dhaka',
            addressCountry: 'BD',
          },
          priceRange: '৳৳',
          paymentAccepted: 'Cash on Delivery',
          currenciesAccepted: 'BDT',
        }
  );

  return (
    <Helmet>
      {/* Standard Meta */}
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={metaUrl} />

      {/* OpenGraph Tags */}
      <meta property="og:site_name" content="Rukhi Bangladesh" />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type === 'product' ? 'og:product' : 'website'} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:locale" content={locale} />

      {/* Product-specific OG meta tags */}
      {type === 'product' && price !== undefined && (
        <meta property="product:price:amount" content={price.toString()} />
      )}
      {type === 'product' && (
        <meta property="product:price:currency" content={currency} />
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLdData)}
      </script>
    </Helmet>
  );
};
