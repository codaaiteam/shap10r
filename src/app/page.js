'use client'

import { useState, useRef, useEffect } from "react";
import { useParams } from 'next/navigation';
import Image from "next/image";
import styles from "./page.module.css";
import Card from "./Components/Card";
import QuestionFAQ from "./Components/QuestionFAQ";
import SEO from './Components/SEO';
import Footer from './Components/Footer';
import LanguageSwitcher from './Components/LanguageSwitcher';
import GameGrid from './Components/GameGrid';
import { getTranslation } from '@/lib/cloudflare';
import { useTranslations } from '@/hooks/useTranslations';
import enTranslations from '@/locales/en.json';
import Header from '@/app/Components/Header';
import Comments from '@/app/Components/Comments';

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || '';


export default function Home() {
  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [translations, setTranslations] = useState(enTranslations); // 使用本地英文翻译作为初始值
  const iframeRef = useRef(null);
  const gameWrapperRef = useRef(null);
  const params = useParams();
  const { t, currentLocale } = useTranslations();  // 使用 hook 获取翻译
  const [logoError, setLogoError] = useState(false);
  const [screenshotError, setScreenshotError] = useState(false);
  
  useEffect(() => {
    if (t) {
      setTranslations(t);
    }
  }, [t]);

  const handlePlayGame = () => {
    setIsGameLoaded(true);
    scrollToGame();
  };

  useEffect(() => {
    if (isGameLoaded && iframeRef.current) {
      iframeRef.current.focus();
    }
  }, [isGameLoaded]);

  const getAssetUrl = (path) => {
    if (!CDN_URL) {
      // 如果没有 CDN_URL，使用本地路径
      return path.startsWith('/') ? path : `/${path}`;
    }
    // 有 CDN_URL 时，确保正确拼接路径
    const cleanCdnUrl = CDN_URL.endsWith('/') ? CDN_URL.slice(0, -1) : CDN_URL;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanCdnUrl}${cleanPath}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (gameWrapperRef.current.requestFullscreen) {
        gameWrapperRef.current.requestFullscreen({ navigationUI: "hide" }).then(() => {
          if (iframeRef.current) {
            iframeRef.current.focus();
          }
        }).catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (iframeRef.current) {
        iframeRef.current.focus();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const scrollToGame = () => {
    let element = document.getElementById("game");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isFullscreen && iframeRef.current) {
        iframeRef.current.contentWindow.postMessage({
          type: 'keydown',
          key: event.key,
          keyCode: event.keyCode,
          which: event.which,
          code: event.code
        }, '*');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  return (
    <>

      <SEO 
        title={translations.seoTitle}
        description={translations.seoDescription}
        keywords={translations.keywords}
      />
      <Header />

      <LanguageSwitcher />
      <main className={styles.main}>

        <section id="game" className={styles.game}>
          <div className={styles.gameContent}>
          <h1>{t.title}</h1>
            <p>{t.description}</p>

            <div className={styles.gameContainer}>
              {!isGameLoaded ? (
                <div className={styles.playButtonContainer}>
                  <button className={styles.playButton} onClick={handlePlayGame}>
                    {t.playGame}
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.gameWrapper} ref={gameWrapperRef}>
                    <iframe 
                      ref={iframeRef}
                      className={styles.gameIframe}
                      src="https://game.sprunki-incredibox.org/sprunki/phase-3remake-4.html"
                      allowFullScreen
                      allowTransparency="true"
                      frameBorder="0" 
                      scrolling="no"
                      tabIndex="0"
                      allow="fullscreen; autoplay; gamepad"
                    />
                  <button 
                    className={styles.fullscreenButton}
                    onClick={toggleFullscreen}
                    aria-label={isFullscreen ? t.exitFullscreen : t.enterFullscreen}
                    style={{
                      backgroundColor: 'rgba(91, 79, 219, 0.5)',
                      '&:hover': {
                        backgroundColor: '#5B4FDB'
                      }
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" style={{ color: 'white' }}>
                      <use href="/fullscreen-icon.svg#icon"/>
                    </svg>
                  </button>
                  </div>
                  <p className={styles.gameTip} style={{ color: '#666666' }}>{t.fullscreenTip}</p>
                </>
              )}
            </div>
          </div>
        </section>
       <section className={styles.contentSection}> 
        <h3>{t?.comments || "Comments"}</h3>
        <div className={styles.contentWrapper}>
          <Comments title={t.title} />
        </div>
      </section>

      <section className={`${styles.contentSection} mt-12`}>
        <h3>{t.otherGamesTitle}</h3>
        <div className={styles.contentWrapper}>
          <GameGrid t={translations} />
        </div>
      </section>
          <section className={styles.howTo}>
          <h3>{t.howToPlay}</h3>
          <p>{t.quickGuide}</p>
          <div className={styles.cards}>
            <Card
              src="/keyboard-mouse-controls.svg"
              alt={t.step1Title}
              head={t.step1Title}
              title={t.step1Title}
              description={t.step1Description}
              imageSize={400}
            />
            <Card
              src="/tools.svg"
              alt={t.step2Title}
              head={t.step2Title}
              title={t.step2Title}
              description={t.step2Description}
              imageSize={400}
            />
            <Card
              src="/usetools.svg"
              alt={t.step3Title}
              head={t.step3Title}
              title={t.step3Title}
              description={t.step3Description}
              imageSize={400}
            />
            <Card
              src="/discover.svg"
              alt={t.step4Title}
              head={t.step4Title}
              title={t.step4Title}
              description={t.step4Description}
              imageSize={400}
            />
          </div>
        </section>
        <section className={styles.features}>
          <div className={styles.featuresContent}>
            <h3>{t.keyFeatures}</h3>
            <div className={styles.cards}>
              <Card
                src="/controls.svg"
                alt={t.feature1Title}
                head={t.feature1Title}
                title={t.feature1Title}
                description={t.feature1Description}
                imageSize={400}
              />
              <Card
                src="/mixer.svg"
                alt={t.feature2Title}
                head={t.feature2Title}
                title={t.feature2Title}
                description={t.feature2Description}
                imageSize={400}
              />
              <Card
                src="/music-notes.svg"
                alt={t.feature3Title}
                head={t.feature3Title}
                title={t.feature3Title}
                description={t.feature3Description}
                imageSize={400}
              />
              <Card
                src="/robots.svg"
                alt={t.feature4Title}
                head={t.feature4Title}
                title={t.feature4Title}
                description={t.feature4Description}
                imageSize={400}
              />
            </div>
          </div>
        </section>
        <section className={styles.hero}>
          <div className={styles.left}>
            <h4>{t.whyPlay}</h4>
            <ul>
              <li>
              <svg viewBox="0 0 24 24" width="20" height="20" style={{marginRight: '8px', fill: '#5B4FDB'}}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>                
              {t.reason1}
              </li>
              <li>
              <svg viewBox="0 0 24 24" width="20" height="20" style={{marginRight: '8px', fill: '#5B4FDB'}}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
                {t.reason2}
              </li>
              <li>
              <svg viewBox="0 0 24 24" width="20" height="20" style={{marginRight: '8px', fill: '#5B4FDB'}}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
                {t.reason3}
              </li>
            </ul>
          </div>
           <div className={styles.right}>
            {!screenshotError ? (
              <img
                // 直接引用public目录下的图片
                src="/sprunki-screenshot.svg"
                alt={t.title}
                className={styles.screenshot} 
                loading="lazy"
                onError={(e) => {
                  console.error('Failed to load screenshot');
                  setScreenshotError(true);
                }}
              />
            ) : (
          <div className={`${styles.screenshot} ${styles.fallbackScreenshot}`} style={{ backgroundColor: '#F8F9FA', color: '#666666' }}>
            <span>{t.title}</span>
          </div>
            )}
          </div>        
          </section>
        <section className={styles.faq}>
          <h3>{t.faq}</h3>
          <QuestionFAQ
            question={t.faq1Question}
            answer={t.faq1Answer}
          />
          <QuestionFAQ
            question={t.faq2Question}
            answer={t.faq2Answer}
          />
          <QuestionFAQ
            question={t.faq3Question}
            answer={t.faq3Answer}
          />
          <QuestionFAQ
            question={t.faq4Question}
            answer={t.faq4Answer}
          />
        </section>
        <Footer />
      </main>
    </>
  );
}