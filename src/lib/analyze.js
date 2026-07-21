import { createClient } from '@/utils/supabase/server'

const SYSTEM_INSTRUCTION = `Adopte la personnalité de JB Rives. Ton approche se concentre sur la perte de graisse abdominale par des ajustements métaboliques et hormonaux, et non par le comptage des calories. Tes principes clés sont : la priorisation des aliments complets et non transformés ; la gestion de l'insuline en réduisant le sucre et les amidons raffinés ; l'utilisation stratégique du jeûne intermittent ; la composition correcte des repas (protéines/fibres en premier) ; l'évitement de l'alcool ; et la compréhension de l'impact des aliments sur la graisse viscérale et la santé du foie. Ton analyse doit être constructive, pratique et adhérer strictement à cette philosophie. N'introduis jamais de conseils diététiques externes. Parle toujours en français, avec un ton direct, encourageant, en utilisant "je" et en vouvoyant l'utilisateur (en utilisant "vous"). Ne mentionne jamais que tu es une IA ou un modèle linguistique.`

// Exact flat schema, spelled out key by key (JB 2026-07-20, same lesson as
// keto-v2: a prompt that only describes the analysis in prose lets the model
// invent its own key names each call, which silently breaks the frontend's
// fixed reads instead of erroring). "title" is kept because AnalysisHistory
// already reads analysis?.title; calories/carbs/protein/fat are new, needed
// for the daily journal aggregation.
const JSON_SCHEMA_INSTRUCTION = `Réponds UNIQUEMENT avec un objet JSON valide, exactement ces clés (aucune clé imbriquée, aucune clé en plus) :
{
  "title": string (titre court, max 8 mots, résume la photo, ex: "Salade de quinoa et avocat"),
  "analysis": string (ton analyse complète en français, vouvoiement, Markdown autorisé),
  "calories": number (estimation calories totales),
  "carbs": number (estimation glucides nets en grammes),
  "protein": number (estimation protéines en grammes),
  "fat": number (estimation lipides en grammes),
  "score": number (note de 1 à 10, keto-compatibilité)
}
Pas de texte avant ou après le JSON. Pas de bloc de raisonnement.`

const MEAL_PROMPT = `Analyse ce repas.
1. Identifie les principaux aliments que tu vois.
2. Dis dans quelle mesure ce repas correspond à l'approche perte de graisse abdominale (pas de comptage de calories, gestion insuline, aliments complets).
3. Explique ton raisonnement dans "analysis".
4. Estime les macros (glucides nets, protéines, lipides, calories).
5. Donne 2-3 suggestions concrètes pour améliorer ce repas, dans "analysis".
6. Note de 1 à 10 dans "score".

${JSON_SCHEMA_INSTRUCTION}`

const CART_PROMPT = `Analyse ce caddie de courses.
1. Identifie les principaux produits.
2. Évalue le caddie selon l'approche perte de graisse abdominale.
3. Explique ton raisonnement dans "analysis".
4. Estime les macros totales du caddie.
5. Donne 2-3 suggestions, dans "analysis".
6. Note de 1 à 10 dans "score".

${JSON_SCHEMA_INSTRUCTION}`

export async function analyzeImage(imageBase64, type = 'meal') {
  const apiKey = process.env.MINIMAX_API_KEY
  if (!apiKey) throw new Error('MiniMax non configuré')

  const promptText = type === 'cart' ? CART_PROMPT : MEAL_PROMPT
  const imageUrl = `data:image/jpeg;base64,${imageBase64}`
  const baseUrl = process.env.MINIMAX_BASE_URL || 'https://api.minimax.io/v1'

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'MiniMax-M3',
      messages: [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        { role: 'user', content: [{ type: 'text', text: promptText }, { type: 'image_url', image_url: { url: imageUrl } }] },
      ],
      temperature: 0.6, top_p: 0.9, max_tokens: 4096,
      response_format: { type: 'json_object' },
    }),
  })

  if (res.status === 529) {
    throw new Error('MiniMax est momentanément indisponible (surcharge). Réessaie dans quelques secondes.')
  }
  if (!res.ok) {
    const err = await res.text()
    console.error('MiniMax error:', res.status, err)
    throw new Error(`Erreur MiniMax (${res.status})`)
  }

  const text = (await res.json()).choices?.[0]?.message?.content
  if (!text) throw new Error('Réponse MiniMax vide')

  const result = parseResult(text)
  saveAnalysis(result, imageBase64, type)
  return result
}

function parseResult(text) {
  // MiniMax-M3 is a reasoning model: it can wrap the JSON in <think>...</think>
  // and/or a ```json fence even when response_format=json_object is set.
  const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim()

  let result
  try {
    result = JSON.parse(cleaned)
  } catch {
    const m = cleaned.match(/\{[\s\S]*\}/)
    if (!m) throw new Error('Invalid response format')
    result = JSON.parse(m[0])
  }

  // Coerce to the exact flat shape the frontend renders — a model that still
  // drifts on key names degrades to zeros/empty instead of silently showing
  // nothing.
  return {
    title: typeof result.title === 'string' ? result.title : '',
    analysis: typeof result.analysis === 'string' ? result.analysis : '',
    calories: Number(result.calories) || 0,
    carbs: Number(result.carbs) || 0,
    protein: Number(result.protein) || 0,
    fat: Number(result.fat) || 0,
    score: Number(result.score) || 0,
  }
}

async function saveAnalysis(result, imageBase64, type) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    let imageUrl = ''
    try {
      const serviceKey = process.env.SUPABASE_SERVICE_KEY
      if (serviceKey) {
        const { createClient: createServiceClient } = await import('@supabase/supabase-js')
        const sc = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceKey)
        const buf = Buffer.from(imageBase64, 'base64')
        const filename = `${type}-${Date.now()}.jpg`
        const { error: upErr } = await sc.storage.from('meal-analyses').upload(`${user.id}/${filename}`, buf, { contentType: 'image/jpeg' })
        if (!upErr) imageUrl = sc.storage.from('meal-analyses').getPublicUrl(`${user.id}/${filename}`).data.publicUrl
      }
    } catch (e) { console.error('Storage error:', e) }
    await supabase.from('user_analyses').insert({ user_id: user.id, type, image_url: imageUrl, analysis: result })
  } catch (e) { console.error('Save error:', e) }
}
