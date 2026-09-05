import Link from 'next/link';

export default function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null;

  // Generate JSON-LD for BreadcrumbList
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Fil d'Ariane" className="py-4 text-sm text-gray-600 dark:text-zinc-400 mb-2">
        <ol className="flex flex-wrap items-center space-x-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center">
                {isLast ? (
                  <span className="text-gray-900 dark:text-white font-medium" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={item.item}
                      className="hover:text-gray-900 dark:hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 rounded transition-colors"
                    >
                      {item.name}
                    </Link>
                    <span className="mx-2 text-gray-400 dark:text-zinc-600" aria-hidden="true">
                      ›
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
