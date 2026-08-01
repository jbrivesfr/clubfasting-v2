'use client'

import { NewsfeedProvider } from '@/components/newsfeed/NewsfeedProvider'
import { NewsfeedFeed } from '@/components/newsfeed/NewsfeedFeed'
import { JourneyTabs } from '@/components/newsfeed/JourneyTabs'
import { ThemeToggle } from '@/components/ThemeToggle'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export default function NewsfeedPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://app.clubfasting.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Newsfeed",
        "item": "https://app.clubfasting.com/newsfeed"
      }
    ]
  };

  return (
    <NewsfeedProvider>
      <div className="min-h-screen bg-[#faf6ec] text-zinc-900 dark:bg-zinc-950 dark:text-white relative overflow-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Ambient glows */}
        <div
          className="fixed inset-x-0 top-0 h-[700px] -z-0 pointer-events-none animate-pulse-glow"
          style={{
            background:
              'radial-gradient(50% 50% at 15% 0%, rgba(251,146,60,0.18) 0%, transparent 60%), radial-gradient(40% 50% at 85% 5%, rgba(239,68,68,0.12) 0%, transparent 60%)',
          }}
        />
        <div
          className="fixed inset-x-0 bottom-0 h-[400px] -z-0 pointer-events-none opacity-60"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 100%, rgba(56,189,248,0.08) 0%, transparent 60%)',
          }}
        />

        {/* Header */}
        <header className="relative z-20 border-b border-[#e2d9c3] dark:border-white/[0.06] backdrop-blur-xl bg-[#faf6ec]/70 dark:bg-zinc-950/40 sticky top-0">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
            <Link href="/" className="dark:bg-white/95 dark:rounded-lg dark:px-2.5 dark:py-1.5">
              <img
                src="/club-fasting-logo.png"
                alt="Logo Club Fasting, l'application pour votre jeûne intermittent"
                className="h-12 w-auto"
              />
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.04]">
                Dashboard
              </Link>
            </div>
          </div>
        </header>

        <main className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 py-10 sm:py-14 space-y-14">
          <Breadcrumbs
            items={[
              { name: 'Accueil', href: '/' },
              { name: 'Newsfeed', href: '/newsfeed' }
            ]}
          />

          <section className="animate-slide-up">
            <h2 className="text-2xl font-bold mb-6 font-display">Fil d&apos;actualités</h2>
            <JourneyTabs />
            <NewsfeedFeed />
          </section>

          <Footer />
        </main>
      </div>
    </NewsfeedProvider>
  )
}
