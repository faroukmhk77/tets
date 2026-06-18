import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product';
  price?: number;
  currency?: string;
  availability?: string;
  brand?: string;
  noIndex?: boolean;
}

export default function SEO({
  title = 'Vintage Sneakers Assouli | Sneakers Vintage de Luxe au Maroc',
  description = 'Vintage Sneakers Assouli - La première boutique marocaine de sneakers vintage authentiques. Livraison partout au Maroc. Paiement à la livraison.',
  image = 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200',
  url = 'https://vintage-sneakers-assouli.ma',
  type = 'website',
  price,
  currency = 'MAD',
  availability,
  brand = 'Vintage Sneakers Assouli',
  noIndex = false,
}: Props) {
  const schemaOrg = type === 'product' && price ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": title,
    "description": description,
    "image": image,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": availability === 'InStock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      "seller": {
        "@type": "Organization",
        "name": "Vintage Sneakers Assouli"
      }
    }
  } : {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Vintage Sneakers Assouli",
    "description": description,
    "url": url
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Vintage Sneakers Assouli" />
      <meta property="og:locale" content="fr_MA" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Product specific */}
      {type === 'product' && price && (
        <meta property="product:price:amount" content={price.toString()} />
      )}
      {type === 'product' && (
        <meta property="product:price:currency" content={currency} />
      )}
      {availability && (
        <meta property="product:availability" content={availability} />
      )}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrg)}
      </script>
    </Helmet>
  );
}
