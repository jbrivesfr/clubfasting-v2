'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BackLink from '@/components/BackLink'

const QUESTIONS = [
  { step: 1, key: 'prenom', question: "D'abord, quel est votre prénom ?", type: 'open' },
  { step: 2, key: 'signe', question: 'Quel signe de métabolisme ralenti vous gêne le plus ?', type: 'mcq', answers: [
    'Le manque d\'énergie', 'La sensibilité au froid', 'Les derniers kilos résistants',
    'Les envies de sucre', 'Le stress qui dure', 'Digestion difficile'
  ]},
  { step: 3, key: 'fasting', question: 'Suivez-vous déjà le jeûne intermittent ?', type: 'mcq', answers: [
    'Oui tous les jours', "Pas tout le temps / J\'ai déjà essayé", 'Non, pas encore'
  ]},
  { step: 4, key: 'repas', question: 'Combien de repas faites-vous par jour (sans collations) ?', type: 'mcq', answers: [
    '1 repas', '2 repas', '3 repas', 'Plus de 3 repas'
  ]},
  { step: 5, key: 'boisson', question: 'Quelle boisson consommez-vous pendant le jeûne ?', type: 'open' },
  { step: 6, key: 'alimentation', question: 'Comment définiriez-vous votre alimentation ?', type: 'mcq', answers: [
    'Je mange un peu de tout', 'J\'évite le gras / le sel', 'Low Carb / Cétogène',
    'Flexitarien / moins de viande', 'Végétarien / Vegan'
  ]},
  { step: 7, key: 'routine', question: 'Décrivez brièvement votre routine alimentaire actuelle. Avec quoi cassez-vous le jeûne ?', type: 'textarea' },
  { step: 8, key: 'proteines', question: 'Avez-vous une idée de votre apport en protéines ?', type: 'mcq', answers: [
    'Pas du tout', 'Je n\'en mange pas assez', 'Je fais attention',
    'À chaque repas !', 'Régime riche en protéines'
  ]},
  { step: 9, key: 'accompagnement', question: "Dans vos assiettes, quel est l'accompagnement par défaut ?", type: 'mcq', answers: [
    'Pâtes, riz, pommes de terre', 'Plutôt légumes ou salade', 'Bonnes graisses ou produits laitiers'
  ]},
  { step: 10, key: 'sucre', question: 'Quelle est votre relation au sucre ?', type: 'mcq', answers: [
    'Ça va, de temps en temps', 'Pas trop mal, mais du mal à m\'arrêter',
    'Les envies de sucre trop souvent', 'Aucune / régime sans sucre'
  ]},
  { step: 11, key: 'cuisson', question: 'Quelle graisse utilisez-vous pour la cuisson ?', type: 'mcq', answers: [
    'J\'évite le gras', 'Beurre', 'Huile d\'olive', 'Huile végétale / margarine', 'Huile de coco'
  ]},
  { step: 12, key: 'legumes', question: 'Mangez-vous beaucoup de légumes ?', type: 'mcq', answers: [
    'Non, pas plus que ça', 'J\'en ajoute à l\'occasion', 'Oui, surtout crus', 'À chaque repas'
  ]},
  { step: 13, key: 'sommeil', question: 'Comment dormez-vous ?', type: 'mcq', answers: [
    'Pas très bien (moins de 6h)', 'Moyen mais je me rattrape', 'Très bien !'
  ]},
  { step: 14, key: 'stress', question: 'Avez-vous des moments d\'anxiété / stress ?', type: 'mcq', answers: [
    'Non jamais', 'De temps en temps mais je gère', 'Un peu sous pression en ce moment'
  ]},
  { step: 15, key: 'detente', question: 'Que faites-vous pour vous détendre ? Une routine ?', type: 'open' },
  { step: 16, key: 'activite', question: 'Quelle est votre activité physique ?', type: 'mcq', answers: [
    'Je ne bouge pas beaucoup', 'Je bouge pas mal mais pas de sport',
    'Petite séance 1-2 fois par semaine', 'Actif, presque tous les jours'
  ]},
  { step: 17, key: 'objectif', question: "Qu'aimeriez-vous atteindre ? Qu'est-ce qui pourrait changer ?", type: 'open' },
]

function generateRecommendations(answers) {
  const advice = []
  const prenom = answers.prenom || ''

  // Intro
  let intro = `${prenom ? prenom + ', ' : ''}voici votre bilan métabolique personnalisé.`
  if (answers.signe) {
    const signe = answers.signe.toLowerCase()
    if (signe.includes('énergie')) intro += " Le manque d'énergie est un signe classique de métabolisme ralenti."
    else if (signe.includes('froid')) intro += " La sensibilité au froid indique souvent une thyroïde qui tourne au ralenti."
    else if (signe.includes('kilos')) intro += " Les kilos résistants sont typiques d'un métabolisme adapté à stocker."
    else if (signe.includes('sucre')) intro += " Les envies de sucre signalent des fluctuations d'insuline."
    else if (signe.includes('stress')) intro += " Le stress chronique élève le cortisol, ce qui bloque la perte de poids."
    else if (signe.includes('digestion')) intro += " Une digestion difficile peut indiquer une inflammation intestinale."
  }

  // Repas
  if (answers.repas === '1 repas') {
    advice.push({ title: 'Nombre de repas', text: "Un repas par jour, c'est peut-être un peu léger. Un deuxième repas serait une bonne idée pour la durée du programme, surtout pour atteindre vos besoins en protéines.", icon: '🍽️' })
  } else if (answers.repas === 'Plus de 3 repas') {
    advice.push({ title: 'Nombre de repas', text: "Plus de 3 repas par jour maintient l'insuline élevée en continu. Essayez de regrouper vos repas dans une fenêtre de 6-8h pour laisser votre métabolisme se reposer.", icon: '🍽️' })
  }

  // Alimentation
  if (answers.alimentation === "J'évite le gras / le sel") {
    advice.push({ title: 'Le gras est essentiel', text: "Éviter le gras peut ralentir votre métabolisme. Les bonnes graisses (olive, coco, avocat, poissons gras) sont nécessaires pour vos hormones et votre thyroïde.", icon: '🥑' })
  }
  if (answers.alimentation === 'Végétarien / Vegan') {
    advice.push({ title: 'Protéines végétariennes', text: "En mangeant végétarien, assurez-vous d'avoir assez de protéines complètes. Les œufs, le tofu, les légumineuses et le quinoa sont vos alliés.", icon: '🥚' })
  }

  // Protéines
  if (answers.proteines === "Je n'en mange pas assez" || answers.proteines === 'Pas du tout') {
    advice.push({ title: 'Sources de protéines', text: "Les protéines sont cruciales pour votre métabolisme. Visez 1.6g par kilo de poids idéal. Viande, poisson, œufs, ou pour les végé : tofu, tempeh, légumineuses.", icon: '🥩' })
  }

  // Accompagnement
  if (answers.accompagnement === 'Pâtes, riz, pommes de terre') {
    advice.push({ title: 'Les féculents', text: "Pâtes, riz et pommes de terre apportent beaucoup d'énergie d'un coup. Sans activité physique suffisante, c'est du stockage assuré. Essayez de les remplacer par plus de légumes.", icon: '🍝' })
  }

  // Sucre
  if (answers.sucre === 'Les envies de sucre trop souvent' || answers.sucre === "Pas trop mal, mais du mal à m'arrêter") {
    advice.push({ title: 'Envies de sucré', text: "Les envies de sucre vont souvent de pair avec un métabolisme ralenti. La bonne nouvelle : on peut les éviter avec un peu de préparation. Manger protéines et fibres en premier aide beaucoup.", icon: '🍫' })
  }

  // Cuisson
  if (answers.cuisson === 'Huile végétale / margarine') {
    advice.push({ title: 'Huiles et margarines', text: "Les huiles végétales industrielles et margarines ne sont pas idéales pour le métabolisme. Préférez l'huile d'olive, l'huile de coco ou le beurre pour la cuisson.", icon: '🫒' })
  }
  if (answers.cuisson === "J'évite le gras") {
    advice.push({ title: 'Ne fuyez pas le gras', text: "Éviter le gras en cuisson peut vous priver de nutriments essentiels. Une cuillère d'huile d'olive ou de coco ne fait pas grossir, au contraire.", icon: '🫒' })
  }

  // Légumes crus
  if (answers.legumes === 'Oui, surtout crus') {
    advice.push({ title: 'Légumes crus et thyroïde', text: "Attention : certains légumes crus (brocoli, chou kale, épinards) contiennent des goitrogènes qui peuvent ralentir la thyroïde. La cuisson résout ce problème.", icon: '🥦' })
  }

  // Sommeil
  if (answers.sommeil === 'Pas très bien (moins de 6h)') {
    advice.push({ title: 'Manque de sommeil', text: "Moins de 6h de sommeil augmente le cortisol et les fringales. Priorisez votre sommeil : couchez-vous plus tôt, faites une sieste si possible.", icon: '😴' })
  }

  // Activité
  if (answers.activite === 'Je ne bouge pas beaucoup') {
    advice.push({ title: 'Bouger plus', text: "Pas besoin de sport intensif. L'important est de ne pas rester assis trop longtemps. Marchez 10 min après chaque repas, prenez les escaliers. Chaque mouvement compte.", icon: '🚶' })
  }
  if (answers.activite === 'Actif, presque tous les jours') {
    advice.push({ title: 'Repos et récupération', text: "Vous êtes très actif, c'est bien. Mais le métabolisme a aussi besoin de repos. Pensez à un jour de repos entre les séances intenses.", icon: '🏋️' })
  }

  // Fasting
  if (answers.fasting === 'Non, pas encore') {
    advice.push({ title: 'Débuter le jeûne', text: "Commencez par décaler votre petit-déjeuner d'une heure chaque semaine. L'objectif : arriver à une fenêtre de repas de 8h (ex: 12h-20h).", icon: '⏰' })
  } else if (answers.fasting === "Pas tout le temps / J'ai déjà essayé") {
    advice.push({ title: 'Régularité du jeûne', text: "La clé du jeûne intermittent, c'est la régularité. Même 5 jours sur 7 font une différence. Fixez-vous une fenêtre fixe et tenez-la.", icon: '⏰' })
  }

  return { intro, advice }
}

export default function BilanPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [currentInput, setCurrentInput] = useState('')
  const [result, setResult] = useState(null)

  const q = QUESTIONS[step]

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
      setCurrentInput('')
    } else {
      // Generate results
      const finalAnswers = { ...answers, [q.key]: currentInput }
      const results = generateRecommendations(finalAnswers)
      setResult(results)
    }
  }

  const handleMCQ = (answer) => {
    const newAnswers = { ...answers, [q.key]: answer }
    setAnswers(newAnswers)
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
      setCurrentInput('')
    } else {
      const results = generateRecommendations(newAnswers)
      setResult(results)
    }
  }

  const reset = () => {
    setStep(0)
    setAnswers({})
    setCurrentInput('')
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-[#faf6ec] text-gray-900 dark:bg-zinc-950 dark:text-white">
      <header className="border-b border-[#e2d9c3] dark:border-white/[0.06] backdrop-blur-xl bg-[#faf6ec]/70 dark:bg-zinc-950/40 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <BackLink className="text-sm text-gray-500 hover:text-gray-900 font-medium dark:text-zinc-500 dark:hover:text-white">
            ← Dashboard
          </BackLink>
          <span className="text-sm text-gray-500 dark:text-zinc-400">Bilan Métabolique</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        {result ? (
          /* Results */
          <div className="space-y-8 animate-slide-up">
            <div className="text-center space-y-3">
              <div className="text-5xl">📊</div>
              <h1 className="text-3xl font-black font-display">Votre Bilan Métabolique</h1>
              <p className="text-gray-500 dark:text-zinc-400 text-lg">{result.intro}</p>
            </div>

            <div className="space-y-4">
              {result.advice.map((a, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900/60 border border-[#e2d9c3] dark:border-zinc-800 rounded-xl p-5 flex gap-4">
                  <span className="text-2xl flex-shrink-0">{a.icon}</span>
                  <div>
                    <h3 className="font-semibold text-emerald-400 mb-1">{a.title}</h3>
                    <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">{a.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {result.advice.length === 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
                <p className="text-emerald-400 font-medium text-lg">Excellent !</p>
                <p className="text-gray-500 dark:text-zinc-400 mt-2">Vos réponses indiquent que vous êtes déjà sur la bonne voie. Continuez comme ça !</p>
              </div>
            )}

            <div className="flex gap-3 justify-center pt-4">
              <button onClick={reset} className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 rounded-xl transition-colors border border-[#e2d9c3] dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white">
                Recommencer le bilan
              </button>
              <Link href="/dashboard/planner" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors">
                Créer ma routine
              </Link>
            </div>
          </div>
        ) : (
          /* Quiz */
          <div className="space-y-8 animate-slide-up">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-500">
                <span>Question {step + 1}/{QUESTIONS.length}</span>
                <span>{Math.round(((step + 1) / QUESTIONS.length) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="bg-white dark:bg-zinc-900/60 border border-[#e2d9c3] dark:border-zinc-800 rounded-2xl p-8 space-y-6">
              <h2 className="text-xl font-semibold leading-relaxed">{q.question}</h2>

              {q.type === 'open' || q.type === 'textarea' ? (
                <div className="space-y-4">
                  {q.type === 'textarea' ? (
                    <textarea
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      placeholder="Votre réponse..."
                      rows={4}
                      className="w-full px-4 py-3 bg-[#faf6ec] dark:bg-zinc-800 border border-[#e2d9c3] dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
                      onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) handleNext() }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      placeholder="Votre réponse..."
                      className="w-full px-4 py-3 bg-[#faf6ec] dark:bg-zinc-800 border border-[#e2d9c3] dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
                      onKeyDown={(e) => { if (e.key === 'Enter') handleNext() }}
                    />
                  )}
                  <button
                    onClick={handleNext}
                    disabled={!currentInput.trim()}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white font-semibold rounded-xl transition-colors"
                  >
                    {step < QUESTIONS.length - 1 ? 'Suivant →' : 'Voir mon bilan'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {q.answers.map((a, i) => (
                    <button
                      key={i}
                      onClick={() => handleMCQ(a)}
                      className="w-full text-left px-5 py-4 bg-[#faf6ec] dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-700/50 border border-[#e2d9c3] dark:border-zinc-700/50 hover:border-emerald-500/50 rounded-xl transition-all text-gray-900 dark:text-white"
                    >
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {step > 0 && (
              <button
                onClick={() => { setStep(step - 1); setCurrentInput('') }}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors dark:text-zinc-500 dark:hover:text-white"
              >
                ← Retour
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
