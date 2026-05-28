import { GoogleGenAI } from '@google/genai'
import { createClient } from '@/utils/supabase/server'

const SYSTEM_INSTRUCTION = `Adopte la personnalité de JB Rives. Ton approche se concentre sur la perte de graisse abdominale par des ajustements métaboliques et hormonaux, et non par le comptage des calories. Tes principes clés sont : la priorisation des aliments complets et non transformés ; la gestion de l'insuline en réduisant le sucre et les amidons raffinés ; l'utilisation stratégique du jeûne intermittent ; la composition correcte des repas (protéines/fibres en premier) ; l'évitement de l'alcool ; et la compréhension de l'impact des aliments sur la graisse viscérale et la santé du foie. Ton analyse doit être constructive, pratique et adhérer strictement à cette philosophie. N'introduis jamais de conseils diététiques externes. Parle toujours en français, avec un ton direct, encourageant, en utilisant "je" et en vouvoyant l'utilisateur (en utilisant "vous"). Ne mentionne jamais que tu es une IA ou un modèle linguistique.`

const MEAL_PROMPT = `Analyse ce repas et fournis une réponse au format JSON.
1. Identifie les principaux aliments que je vois.
2. Dis-moi dans quelle mesure ce repas correspond à mon approche pour perdre la graisse du ventre. Donne-moi une évaluation simple (par exemple : Excellent, Bon, Passable, À améliorer).
3. Explique ton raisonnement, en te basant sur mes principes (impact sur l'insuline, ingrédients transformés, équilibre, etc.).
4. Donne-moi 2-3 suggestions concrètes pour améliorer ce repas selon ma philosophie.
5. Attribue une note de 1 à 10, où 1 est très mauvais et 10 est parfait pour mon approche.
Rédige l'analyse comme si je parlais directement à la personne, en la vouvoyant (en utilisant "vous"). Utilise un langage clair et simple, avec Markdown pour la mise en forme du texte de l'analyse. Si tu ne peux pas bien voir ce qu'il y a dans l'assiette, dis-le simplement dans l'analyse.`

const CART_PROMPT = `Analyse ce caddie de courses et fournis une réponse au format JSON.
1. Identifie les principaux aliments/produits que je vois.
2. Dis-moi dans quelle mesure ce caddie correspond à mon approche pour perdre la graisse du ventre. Donne-moi une évaluation simple (par exemple : Excellent, Bon, Passable, À améliorer).
3. Explique ton raisonnement, en te basant sur mes principes (aliments transformés, sucres cachés, équilibre protéines/fibres, etc.).
4. Donne-moi 2-3 suggestions concrètes pour améliorer ce caddie selon ma philosophie.
5. Attribue une note de 1 à 10.
Rédige l'analyse comme si je parlais directement à la personne, en la vouvoyant. Utilise Markdown.`

export async function analyzeImage(imageBase64, type = 'meal') {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('Clé API non configurée')

  const ai = new GoogleGenAI({ apiKey })
  const promptText = type === 'cart' ? CART_PROMPT : MEAL_PROMPT

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
        { text: promptText },
      ],
    },
    config: {
      temperature: 0.6,
      topK: 32,
      topP: 0.9,
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING', description: "Un titre court (max 8 mots) qui résume le contenu de la photo (ex: 'Salade de quinoa et avocat', 'Caddie rempli de produits frais')" },
          analysis: { type: 'STRING', description: "L'analyse détaillée en Markdown" },
          score: { type: 'INTEGER', description: 'Note de 1 à 10' },
        },
        required: ['title', 'analysis', 'score'],
      },
    },
  })

  const resultText = response.text
  if (!resultText) throw new Error("L'API n'a pas retourné d'analyse")

  let result
  try {
    result = JSON.parse(resultText)
  } catch {
    const jsonMatch = resultText.match(/\{[\s\S]*\}/)
    if (jsonMatch) result = JSON.parse(jsonMatch[0])
    else throw new Error('Format de réponse invalide')
  }

  // Save to Supabase if user is authenticated
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // Upload image to storage (needs service key for write access)
      let imageUrl = ''
      try {
        const serviceKey = process.env.SUPABASE_SERVICE_KEY
        if (serviceKey) {
          const { createClient: createServiceClient } = await import('@supabase/supabase-js')
          const storageClient = createServiceClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            serviceKey
          )
          const buffer = Buffer.from(imageBase64, 'base64')
          const filename = `${type}-${Date.now()}.jpg`
          const path = `${user.id}/${filename}`
          const { error: uploadError } = await storageClient.storage
            .from('meal-analyses')
            .upload(path, buffer, {
              contentType: 'image/jpeg',
              upsert: false,
            })
          if (!uploadError) {
            const { data: urlData } = storageClient.storage
              .from('meal-analyses')
              .getPublicUrl(path)
            imageUrl = urlData.publicUrl
          } else {
            console.error('Storage upload error:', JSON.stringify(uploadError))
          }
        }
      } catch (storageError) {
        console.error('Storage error:', storageError)
      }

      // Save analysis
      const { error: insertError } = await supabase.from('user_analyses').insert({
        user_id: user.id,
        type,
        image_url: imageUrl,
        analysis: result,
      })
      if (insertError) console.error('Failed to save analysis:', insertError)
    }
  } catch (dbError) {
    console.error('Failed to save analysis:', dbError)
  }

  return result
}
