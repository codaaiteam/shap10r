import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import styles from './GameGrid.module.css';
import { useEffect, useState } from 'react';
import { getGamesData } from '@/lib/cloudflare';

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || '';

export default function GameGrid({ t, excludeId }) {
  const router = useRouter();
  const params = useParams();
  const currentLang = params?.lang || 'en';
  const [games, setGames] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadGames() {
      try {
        const gamesData = await getGamesData();
        
        if (!isMounted) return;
        const mappedGames = Object.entries(gamesData.games)
          .map(([id, gameData]) => ({
            id,
            title: t?.games?.[id]?.title || gameData.title,
            image: gameData.image ? 
              (gameData.image.startsWith('http') ? 
                gameData.image : 
                `${CDN_URL}${gameData.image.startsWith('/') ? '' : '/'}${gameData.image}`
              ) : null,
            gameUrl: gameData.gameUrl,
            features: [
              t?.games?.[id]?.features?.feature1?.title || gameData.features?.[0],
              t?.games?.[id]?.features?.feature2?.title || gameData.features?.[1],
              t?.games?.[id]?.features?.feature3?.title || gameData.features?.[2],
              t?.games?.[id]?.features?.feature4?.title || gameData.features?.[3]
            ].filter(Boolean)
          }));
        setGames(mappedGames);
      } catch (error) {
        console.error('Failed to load games:', error);
      }
    }
    loadGames();
    return () => {
      isMounted = false;
    };
  }, [t, excludeId]);

  const handleGameClick = (gameId) => {
    router.push(`/${currentLang}/game/${gameId}`);
  };

  const handleImageError = (gameId) => {
    setImageErrors(prev => ({
      ...prev,
      [gameId]: true
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/${currentLang}/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (excludeId ? game.id !== excludeId : true)
  );

  return (
    <section className={styles.gameGridSection}>
 <div className={styles.searchWrapper}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="search..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton} aria-label="搜索">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </form>
      </div>   
      <div className={styles.gameGridWrapper}>
        <div className={styles.gameGrid}>
          {filteredGames.map((game) => (
            <div 
              key={game.id}
              className={styles.gameCard}
              onClick={() => handleGameClick(game.id)}
              role="link"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              title={game.title}
            >
              <div className={styles.imageWrapper}>
                {game.image && !imageErrors[game.id] ? (
                  <img
                    src={game.image}
                    alt={game.title}
                    className={styles.gameImage}
                    loading="lazy"
                    onError={() => handleImageError(game.id)}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">{game.title}</span>
                  </div>
                )}
              </div>
              <h3 className={styles.gameTitle}>
                {game.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}