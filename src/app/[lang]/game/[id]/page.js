'use client'

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import styles from './page.module.css';
import SEO from '@/app/Components/SEO';
import Footer from '@/app/Components/Footer';
import LanguageSwitcher from '@/app/Components/LanguageSwitcher';
import GameGrid from '@/app/Components/GameGrid';
import Link from 'next/link';
import Header from '@/app/Components/Header';
import QuestionFAQ from "@/app/Components/QuestionFAQ";
import { useTranslations } from '@/hooks/useTranslations';
import { getGamesData } from '@/lib/cloudflare'; // 新增
import Comments from '../../../Components/Comments';
import SimpleRating from '../../../Components/SimpleRating';  // 注意调整导入路径

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || '';

const generateGameFaqs = (game, templates) => {
    if (!templates) return [];
  
  // 获取当前游戏的自定义FAQ
  const customFaqs = game.faqs;
  
  // 如果有自定义FAQ，直接使用
  if (customFaqs && Object.keys(customFaqs).length > 0) {
    return Object.values(customFaqs).map(faq => ({
      question: faq.question,
      answer: faq.answer
    }));
  }  
  const replacePlaceholders = (text, gameData) => {
    return text
      .replace(/{gameName}/g, gameData.title)
      .replace(/{description}/g, gameData.description)
      .replace(/{mainFeature}/g, gameData.mainFeature)
      .replace(/{feature1}/g, gameData.features[0])
      .replace(/{feature2}/g, gameData.features[1])
      .replace(/{feature3}/g, gameData.features[2]);
  };
  return Object.keys(templates).map(templateKey => ({
    question: replacePlaceholders(templates[templateKey].question, game),
    answer: replacePlaceholders(templates[templateKey].answer, game)
  }));
};
// Default game content when translations are missing
const defaultGameContent = {
  howToPlay: [
    "Select your favorite sounds and beats",
    "Mix different elements to create music",
    "Build unique compositions",
    "Share your creations with others"
  ],
  features: [
    {
      title: "Mix & Create",
      description: "Combine different sounds to create unique music"
    },
    {
      title: "Easy to Play",
      description: "Simple drag and drop interface"
    },
    {
      title: "Multiple Sounds",
      description: "Wide variety of beats and effects"
    },
    {
      title: "Share Your Music",
      description: "Create and share your compositions"
    }
  ]
};

export default function GamePage() {
 const params = useParams();
 const { t, currentLocale } = useTranslations();
 const [isGameLoaded, setIsGameLoaded] = useState(false);
 const [isFullscreen, setIsFullscreen] = useState(false);
 const [gameFaqs, setGameFaqs] = useState([]);
 const [game, setGame] = useState(null);
 const [gamesData, setGamesData] = useState(null); // 新增
 const { lang, id } = params;
 const [imageError, setImageError] = useState(false);

 const handleImageError = () => {
    console.warn(`Failed to load image for game: ${id}`);
    setImageError(true);
 };
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${CDN_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };


  useEffect(() => {
    async function fetchGames() {
      try {
        const data = await getGamesData();
        setGamesData(data);
        const currentGame = data.games[id];
        
        if (currentGame) {
          // 处理图片路径
          currentGame.processedImage = getImageUrl(currentGame.image);
          setGame(currentGame);

          const gameTranslation = t?.games?.[id];
          const gameFaqContent = gameTranslation?.faqs || currentGame.faqs;
          
          if (gameFaqContent) {
            const customFaqs = Object.values(gameFaqContent).map(faq => ({
              question: faq.question,
              answer: faq.answer
            }));
            setGameFaqs(customFaqs);
          } else if (t?.gameFaqTemplates) {
            const templateFaqs = generateGameFaqs(currentGame, t.gameFaqTemplates);
            setGameFaqs(templateFaqs);
          }
        }
      } catch (error) {
        console.error('Failed to fetch game data:', error);
      }
    }

    fetchGames();
  }, [id, t?.gameFaqTemplates, t?.games]);

  const defaultErrors = {
    gameNotFound: "Game is Loading..",
    gameNotFoundDesc: "Wait for a minute...."
  };

  if (!game) {
    return (
      <div className={styles.errorContainer}>
        <h1>{t?.common?.errors?.loading || defaultErrors.gameNotFound}</h1>
        <p>{t?.common?.errors?.waitforloading || defaultErrors.gameNotFoundDesc}</p>
        <Link href={`/${currentLocale}`} className={styles.backButton}>
          {t?.common?.backToHome || "Back to Home"}
        </Link>
      </div>
    );
  }

  // Get translations for current game
  const currentGameT = t?.games?.[id] || game;

  // Transform nested features object into array
  const getFeatures = () => {
    if (currentGameT?.features) {
      // Handle object structure (new format)
      if (typeof currentGameT.features === 'object' && !Array.isArray(currentGameT.features)) {
        return Object.values(currentGameT.features).map(feature => ({
          title: feature.title,
          description: feature.description
        }));
      }
      // Handle array structure (old format)
      if (Array.isArray(currentGameT.features)) {
        return currentGameT.features;
      }
    }
    // Fallback to game features or default content
    return game.features?.map((feature, index) => ({
      title: feature,
      description: defaultGameContent.features[index]?.description || ''
    })) || defaultGameContent.features;
  };

  // Transform nested howToPlay object into array
  const getHowToPlay = () => {
    if (currentGameT?.howToPlay) {
      // Handle object structure (new format)
      if (typeof currentGameT.howToPlay === 'object' && !Array.isArray(currentGameT.howToPlay)) {
        return Object.values(currentGameT.howToPlay);
      }
      // Handle array structure (old format)
      if (Array.isArray(currentGameT.howToPlay)) {
        return currentGameT.howToPlay;
      }
    }
    return defaultGameContent.howToPlay;
  };

  // Initialize game translations with fallbacks
  const gameT = {
    title: currentGameT?.title || game.title,
    description: currentGameT?.description || game.description || "",
    seo: {
      title: currentGameT?.seo?.title || game.title,
      description: currentGameT?.seo?.description || game.description,
      keywords: currentGameT?.seo?.keywords || `${game.title}, online game, browser game`
    },
    features: getFeatures(),
    howToPlay: getHowToPlay()
  };

  return (
    <>
      <SEO 
        title={gameT.seo.title}
        description={gameT.seo.description}
        keywords={gameT.seo.keywords}
      />
      
      <LanguageSwitcher />
      <Header />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.gameHero}>
          <div className={styles.gameHeroOverlay} />
          <div className={styles.gameHeroContent}>
            <img
              src={game.processedImage}
              alt={gameT.title}
              className={styles.gameHeroImage}
              loading="lazy"
              onError={handleImageError}
            />            
            <div className={styles.gameHeroInfo}>
              <h1>{gameT.title}</h1>
              <p>{gameT.description}</p>
              <button 
                className={styles.playButton}
                onClick={() => {
                  document.querySelector('.gameSection')?.scrollIntoView({ behavior: 'smooth' });
                  setTimeout(() => setIsGameLoaded(true), 500); // Delay game load until after scroll
                }}
              >
                {t?.game?.playNow || "Play Now"}
              </button>
            </div>
          </div>
        </section>

        {/* Game Section */}
        {isGameLoaded && (
          <section className={styles.gameSection}>
            <div className={styles.gameWrapper}>
              <iframe
                src={game.gameUrl}
                className={styles.gameFrame}
                allowFullScreen
                allow="fullscreen; autoplay"
              />
              <button
                className={styles.fullscreenButton}
                onClick={() => setIsFullscreen(!isFullscreen)}
                aria-label={isFullscreen ? t?.game?.exitFullscreen : t?.game?.enterFullscreen}
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <use href="/fullscreen-icon.svg#icon"/>
                </svg>
              </button>
            </div>
            <p className={styles.gameTip}>{t?.game?.fullscreenTip || "Press F11 for fullscreen mode"}</p>
          </section>
        )}
        <section className={styles.comments}>
        <h2>{t?.comments || "Comments"}</h2>
        <Comments title={t.title} />
      </section>
        {/* More Games Section */}
        <section className={styles.moreGames}>
          <h2>{t?.game?.relatedGames || "More Games"}</h2>
          <GameGrid 
            excludeId={game.id}
            t={t}
          />
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <h2>{t?.game?.features || "Features"}</h2>
          <div className={styles.featuresList}>
            {gameT.features.map((feature, index) => (
              <div key={index} className={styles.featureItem}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Play Section */}
        <section className={styles.howToPlay}>
          <h2>{t?.game?.howToPlay || "How to Play"}</h2>
          <div className={styles.steps}>
            {gameT.howToPlay.map((step, index) => (
              <div key={index} className={styles.step}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.faq}>
          <h2>{t?.faq || "Frequently Asked Questions"}</h2>
          <div className={styles.faqList}>
            {gameFaqs.map((faq, index) => (
              <QuestionFAQ
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}