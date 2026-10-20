'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/quiz/ProgressBar';

interface Answers {
  objective?: string;
  dinnerTime?: string;
  fastingWindow?: string;
  pastExperience?: string;
  obstacle?: string;
  email?: string;
}

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totalSteps = 6;

  const handleNextStep = (key: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/quiz/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        throw new Error('Une erreur est survenue lors de l\'enregistrement de vos réponses.');
      }

      router.push('/merci');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md dark:bg-gray-800">
        <div>
          <ProgressBar currentStep={step} totalSteps={totalSteps} />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Votre profil jeûne intermittent
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-6">
              Quel est votre objectif principal ?
            </h3>
            {['perdre du poids', 'gagner en énergie', 'mieux dormir', 'autre'].map((option) => (
              <button
                key={option}
                onClick={() => handleNextStep('objective', option)}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-6">
              À quelle heure dînez-vous habituellement ?
            </h3>
            {['<19h', '19-21h', '>21h'].map((option) => (
              <button
                key={option}
                onClick={() => handleNextStep('dinnerTime', option)}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-6">
              Combien d'heures s'écoulent entre votre dernier repas et votre réveil ?
            </h3>
            {['<8h', '8-10h', '10-12h', '>12h'].map((option) => (
              <button
                key={option}
                onClick={() => handleNextStep('fastingWindow', option)}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-6">
              Avez-vous déjà tenté le jeûne intermittent ?
            </h3>
            {['oui, plusieurs fois', 'oui, une fois', 'non'].map((option) => (
              <button
                key={option}
                onClick={() => handleNextStep('pastExperience', option)}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-6">
              Quel est votre principal frein ?
            </h3>
            {['faim en fin de journée', 'pas le temps de cuisiner', 'pas motivé(e)', 'autre'].map((option) => (
              <button
                key={option}
                onClick={() => handleNextStep('obstacle', option)}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        )}

        {step === 6 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-4">
              Où souhaitez-vous recevoir vos résultats ?
            </h3>

            <div>
              <label htmlFor="email" className="sr-only">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Votre adresse email"
                value={answers.email || ''}
                onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !answers.email}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Analyse en cours...' : 'Voir mon diagnostic'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
