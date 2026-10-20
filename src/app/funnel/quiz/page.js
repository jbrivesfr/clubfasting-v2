'use client';

import { useState } from 'react';

export default function QuizPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    objectif: '',
    experience: '',
    blocage: '',
    disponibilite: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleAnswer = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/lead-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });

      if (response.ok) {
        setIsDone(true);
      } else {
        console.error('Failed to submit quiz');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Combien de temps faut-il pour voir des résultats ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La plupart de nos membres ressentent un regain d'énergie dès la première semaine."
        }
      },
      {
        "@type": "Question",
        "name": "Le jeûne intermittent est-il difficile à suivre ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Avec la bonne méthode et un accompagnement, votre corps s'adapte naturellement en quelques jours."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#1c1917] text-white flex flex-col items-center justify-center p-4 font-sans">
      <script
        type="application/ld+json"
        id="faq-json-ld"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full max-w-md bg-stone-900 rounded-2xl p-6 shadow-xl border border-stone-800">
        {!isDone && step < 5 && (
          <div className="mb-6 flex justify-between items-center text-sm text-stone-400">
            <span>Étape {step} sur 5</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-1 w-6 rounded-full ${i <= step ? 'bg-orange-500' : 'bg-stone-700'}`} />
              ))}
            </div>
          </div>
        )}

        {isDone ? (
          <div className="text-center py-10 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Merci — votre programme arrive par email dans 5 minutes</h2>
            <p className="text-stone-400">Préparez-vous à découvrir une nouvelle approche du jeûne.</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-6 text-center">Quel est votre objectif principal ?</h2>
                <div className="space-y-3">
                  {['Perte de poids', 'Plus d\'énergie', 'Longévité et santé', 'Simple curiosité'].map(option => (
                    <button
                      key={option}
                      onClick={() => handleAnswer('objectif', option)}
                      className="w-full p-4 text-left rounded-xl border border-stone-700 hover:border-orange-500 hover:bg-stone-800 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-6 text-center">Quelle est votre expérience avec le jeûne ?</h2>
                <div className="space-y-3">
                  {['Aucune, je débute', 'J\'ai essayé sans grand succès', 'Je le pratique déjà'].map(option => (
                    <button
                      key={option}
                      onClick={() => handleAnswer('experience', option)}
                      className="w-full p-4 text-left rounded-xl border border-stone-700 hover:border-orange-500 hover:bg-stone-800 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-6 text-center">Quel est votre principal blocage ?</h2>
                <div className="space-y-3">
                  {['Manque de méthode claire', 'Mes horaires sont compliqués', 'La sensation de faim', 'Je ne vois pas de résultats'].map(option => (
                    <button
                      key={option}
                      onClick={() => handleAnswer('blocage', option)}
                      className="w-full p-4 text-left rounded-xl border border-stone-700 hover:border-orange-500 hover:bg-stone-800 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold mb-6 text-center">Quelle est votre disponibilité quotidienne pour jeûner ?</h2>
                <div className="space-y-3">
                  {['Moins de 12 heures', 'Entre 12 et 16 heures', '16 heures ou plus'].map(option => (
                    <button
                      key={option}
                      onClick={() => handleAnswer('disponibilite', option)}
                      className="w-full p-4 text-left rounded-xl border border-stone-700 hover:border-orange-500 hover:bg-stone-800 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-center">Découvrez votre programme personnalisé</h2>
                <p className="text-center text-stone-400 mb-6 text-sm">
                  Nous avons analysé vos réponses. Entrez votre email pour recevoir vos résultats immédiatement.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    required
                    placeholder="Votre adresse email"
                    value={answers.email}
                    onChange={(e) => setAnswers(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-4 rounded-xl bg-stone-900 border border-stone-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-white"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !answers.email}
                    className="w-full p-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Analyse en cours...' : 'Recevoir mon programme'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
