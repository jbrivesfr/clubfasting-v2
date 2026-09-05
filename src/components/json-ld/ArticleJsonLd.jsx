export default function ArticleJsonLd({
  url,
  title,
  description,
  datePublished,
  dateModified,
  authorName,
  imageUrl,
  type = 'Article'
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#article`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "headline": title,
    ...(description && { "description": description }),
    "datePublished": datePublished,
    ...(dateModified && { "dateModified": dateModified }),
    "author": {
      "@type": "Person",
      "name": authorName || 'Le Fasting'
    },
    "publisher": {
      "@type": "Organization",
      "name": "Club Fasting",
      "logo": {
        "@type": "ImageObject",
        "url": "https://app.clubfasting.com/club-fasting-logo.png"
      }
    },
    ...(imageUrl && { "image": imageUrl })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
