import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'

import en from '../locales/en.json'
import ja from '../locales/ja.json'
import ko from '../locales/ko.json'
import de from '../locales/de.json'
import fr from '../locales/fr.json'
import it from '../locales/it.json'
import es from '../locales/es.json'
import zh from '../locales/zh.json'
import ru from '../locales/ru.json'
import zhtw from '../locales/zh-tw.json'

const translations = { en, ja, ko, de, fr, it, es, zh, ru, zhtw }
const locales = Object.keys(translations)
const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata({ params }) {
  const locale = params?.lang || 'en'
  const t = translations[locale]
  
  const baseUrl = 'https://www.playshap10r.org'
  const currentUrl = `${baseUrl}/${locale}`
  
  const languageAlternates = locales.reduce((acc, lang) => {
    acc[lang] = `${baseUrl}/${lang}`
    return acc
  }, {})

  return {
    metadataBase: new URL(baseUrl),
    title: t.seoTitle,
    description: t.seoDescription,
    keywords: t.keywords.split(', '),
    openGraph: {
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      type: t.meta.ogType,
      url: currentUrl,
      images: [{ url: t.meta.ogImage }],
      locale: locale,
      alternateLocales: locales.filter(l => l !== locale),
    },
    twitter: {
      card: t.meta.twitterCard,
      title: t.meta.twitterTitle,
      description: t.meta.twitterDescription,
      images: [t.meta.twitterImage],
    },
    alternates: {
      canonical: currentUrl,
      languages: languageAlternates,
    },
    robots: t.seo.robots,
  }
}

export default function RootLayout({ children, params }) {
  const locale = params?.lang || 'en'
  const t = translations[locale]

  return (
    <html lang={t.layout.language}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="ejTNzps4rUJKSZrNs1b57sjcCQU5MdlsNxUCvhIgJuU" />
      </head>
      <body className={inter.className}>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${t.seo.googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${t.seo.googleAnalyticsId}');
          `}
        </Script>
      </body>
    </html>
  )
}