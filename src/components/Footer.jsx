import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="pt-8 pb-4 text-center text-xs text-gray-500 border-t border-[#e2d9c3] dark:border-white/[0.04]">
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Méthodes de jeûne</h4>
        <ul className="flex justify-center space-x-4">
          <li>
            <Link href="/jeune-intermittent-16-8" className="hover:underline">
              16/8
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">
              18/6
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">
              5:2
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:underline">
              jeûne 24h
            </Link>
          </li>
        </ul>
      </div>
      <p>Club Fasting · v2.6</p>
    </footer>
  );
}
