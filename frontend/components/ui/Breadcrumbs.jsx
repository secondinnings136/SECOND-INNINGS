import Link from 'next/link';

/**
 * Editorial Breadcrumbs component with embedded Schema.org BreadcrumbList JSON-LD
 * items: Array of { name: string, href?: string }
 */
export default function Breadcrumbs({ items = [] }) {
  const allItems = [{ name: 'Home', href: '/' }, ...items];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href ? `https://second-innings.in${item.href}` : 'https://second-innings.in',
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-xs text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            return (
              <li key={item.name} className="flex items-center gap-2">
                {isLast || !item.href ? (
                  <span className="text-ink font-medium" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-ink transition-colors">
                    {item.name}
                  </Link>
                )}
                {!isLast && <span aria-hidden="true" className="text-line">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
