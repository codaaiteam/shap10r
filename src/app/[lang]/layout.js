'use client'

import '../globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getTranslation } from '@/lib/cloudflare'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const params = useParams()
  const [translations, setTranslations] = useState(null)
  const locale = params?.lang || 'en'

  useEffect(() => {
    async function loadTranslations() {
      const t = await getTranslation(locale)
      setTranslations(t)
    }
    loadTranslations()
  }, [locale])

  if (!translations) {
    return null
  }

  return (
    <html lang={locale}>
      <head>
        {translations.seo?.googleSiteVerification && (
          <meta 
            name="google-site-verification" 
            content={translations.seo.googleSiteVerification} 
          />
        )}
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}