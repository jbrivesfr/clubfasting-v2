const fs = require('fs');

let content = fs.readFileSync('src/app/page.js', 'utf8');

// The file has import Link from 'next/link'
content = content.replace("import Link from 'next/link'", "import Link from 'next/link'\nimport Breadcrumb from '@/components/ui/Breadcrumb'");

// Replace the old jsonLd BreadcrumbList inside the array.
// Instead of complex regex, let's just insert the Breadcrumb component visually
// But wait, since it's the root page ('/'), breadcrumb 'Accueil > ' doesn't make sense or it's just 'Accueil'.
// Actually, I won't add breadcrumb to the root page, it usually doesn't need one. The prompt says "pages : méthode, programmes (et chaque sous-programme), communauté, FAQ, newsfeed (feed + post individuel), articles de blog" - Home isn't in this list.
