// app/[lang]/game/[id]/seo-config.js
export const enhancedSEOConfig = (game, lang, baseUrl) => {
  const currentUrl = `${baseUrl}/${lang}/game/${game.id}`;
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.description,
    genre: 'Music Game',
    gamePlatform: 'Web Browser',
    applicationCategory: 'Game',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.1',
      ratingCount: '108',
      bestRating: '5',
      worstRating: '1'
    }
  };

  return {
    metadataBase: new URL(baseUrl),
    title: `Play ${game.title} - Online Music Making Game`,
    description: `${game.description} Create and mix music online for free.`,
    
    openGraph: {
      title: `Play ${game.title} - Music Creation Game`,
      description: game.description,
      type: 'website',
      url: currentUrl,
      images: [{
        url: `${baseUrl}${game.image}`,
        width: 1200,
        height: 630,
        alt: game.title
      }],
      locale: lang,
      siteName: 'Sprunki Games'
    },
    
    twitter: {
      card: 'summary_large_image',
      site: '@SprunkiGames',
      creator: '@SprunkiGames',
      title: `Play ${game.title}`,
      description: game.description,
      images: [`${baseUrl}${game.image}`]
    },
    
    alternates: {
      canonical: currentUrl,
      languages: {
        'en': `${baseUrl}/en/game/${game.id}`,
        'zh': `${baseUrl}/zh/game/${game.id}`,
        'es': `${baseUrl}/es/game/${game.id}`
      }
    },
    
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    },
    
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      bing: process.env.NEXT_PUBLIC_BING_VERIFICATION
    },
    
    other: {
      'format-detection': 'telephone=no'
    }
  };
};
