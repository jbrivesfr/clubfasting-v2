import Link from 'next/link';

export function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex">
      <ol className="flex items-center space-x-2 text-sm text-zinc-500 dark:text-zinc-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.name} className="flex items-center">
              {isLast ? (
                <span className="font-medium text-zinc-900 dark:text-zinc-100" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <span className="mx-2 text-zinc-400 dark:text-zinc-600">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
