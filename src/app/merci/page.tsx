import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Merci - Découvrez vos résultats',
  description: 'Vos résultats ont bien été pris en compte.',
};

export default function MerciPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md dark:bg-gray-800 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Merci pour votre participation !
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Vos réponses ont bien été enregistrées. Votre diagnostic personnalisé vous sera envoyé par email d'ici quelques instants.
          </p>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg dark:bg-gray-700">
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Pour aller plus loin...
            </h3>
            <p className="text-blue-600 dark:text-blue-300">
              Découvrez la méthode originelle 12h/16h pour maximiser vos résultats de manière durable et naturelle.
            </p>
            <div className="mt-4">
               <Link href="/jeune-intermittent-16-8" className="text-sm font-medium text-blue-700 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  En savoir plus sur le 16/8 &rarr;
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
