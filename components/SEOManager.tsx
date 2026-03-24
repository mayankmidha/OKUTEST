import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  image?: string
  url: string
  type?: 'website' | 'article'
  author?: string
  publishedTime?: string
  category?: string
}

export function SEOManager({ 
  title, 
  description, 
  image = 'https://okutherapy.com/og-image.png', 
  url, 
  type = 'website',
  author,
  publishedTime,
  category
}: SEOProps) {
  const fullTitle = `${title} | OKU Clinic`
  const siteName = 'OKU Clinic'

  const jsonLd = type === 'article' ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "image": [image],
    "datePublished": publishedTime,
    "author": [{
        "@type": "Person",
        "name": author || "OKU Clinical Team",
        "url": "https://okutherapy.com/people"
      }],
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": "https://okutherapy.com/logo.png"
      }
    },
    "description": description
  } : {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": "https://okutherapy.com",
    "description": description
  };

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
