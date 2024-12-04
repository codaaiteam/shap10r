// app/[lang]/game/[id]/layout.js
import games from '@/data/games.json';
import en from '@/locales/en.json';
import Analytics from '@/app/Components/Analytics';
import { getGamesData, getTranslation } from '@/lib/cloudflare';

export async function generateMetadata({ params }) {
  const { lang, id } = params;
  
  // 从 games 获取游戏基本信息
  const { games: gamesData } = await getGamesData();
  const game = gamesData[id];
  const t = await getTranslation(lang);
  if (!game) return {};

  // 获取语言特定的数据
  const gameSeoData = t?.games?.[id]?.seo || {};
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.playsprunkiphase4.com';
  const currentUrl = `${baseUrl}/${lang}/game/${id}`;

  // 构建SEO数据
  const seoTitle = gameSeoData.title || game.title;
  const seoDescription = gameSeoData.description || 
    `Experience ${game.title} - An exciting game adventure with unique features and immersive gameplay.`;

  return {
    metadataBase: new URL(baseUrl),
    title: seoTitle,
    description: seoDescription,
    
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'website',
      url: currentUrl,
      images: [{
        url: `${baseUrl}${game.image}`,
        width: 800,
        height: 600,
        alt: game.title
      }],
      locale: lang,
    },
    
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [`${baseUrl}${game.image}`],
    },
    
    keywords: gameSeoData.keywords || `${game.title}, music creation, rhythm game, interactive gameplay`,
    
    alternates: {
      canonical: currentUrl,
      languages: {
        'en': `${baseUrl}/en/game/${id}`,
        'zh': `${baseUrl}/zh/game/${id}`,
        'ja': `${baseUrl}/ja/game/${id}`,
        'ko': `${baseUrl}/ko/game/${id}`,
        'de': `${baseUrl}/de/game/${id}`,
        'fr': `${baseUrl}/fr/game/${id}`,
        'it': `${baseUrl}/it/game/${id}`,
        'es': `${baseUrl}/es/game/${id}`
      }
    }
  };
}

export default function GameLayout({ children }) {
  return (
    <>
      <Analytics />
      {children}
    </>
  );
}