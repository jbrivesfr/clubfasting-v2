# Club Fasting v2

Application Next.js / Supabase pour Club Fasting.

## Comment activer le panel Google Search Console (Blackboard)

Le panel GSC permet de suivre le trafic et l'engagement SEO des articles. Pour l'activer :

1. Allez dans la [Google Cloud Console](https://console.cloud.google.com/).
2. Activez l'API **Google Search Console API**.
3. Créez un **Compte de Service (Service Account)** et générez une clé JSON.
4. Allez dans les paramètres de votre propriété [Google Search Console](https://search.google.com/search-console).
5. Ajoutez l'email du compte de service avec le droit **Lecture seule**.
6. Dans le fichier `.env.local` (ou vos variables d'environnement de prod), ajoutez les variables listées dans `.env.example` (soit via `GOOGLE_APPLICATION_CREDENTIALS_BASE64`, soit via email/clé privée).
