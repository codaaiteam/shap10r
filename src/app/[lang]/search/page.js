// app/[lang]/search/page.js
'use client'

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import GameGrid from '@/app/Components/GameGrid';
import styles from './search.module.css';
import { getGamesData } from '@/lib/cloudflare';
import { useTranslations } from '@/hooks/useTranslations';
import Link from 'next/link';
import Header from '@/app/Components/Header';
import LanguageSwitcher from '@/app/Components/LanguageSwitcher';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const { t } = useTranslations();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const query = searchParams.get('q');

  useEffect(() => {
    async function searchGames() {
      try {
        setLoading(true);
        const data = await getGamesData();
        
        // 简单的搜索实现
        const filteredGames = Object.entries(data.games)
          .filter(([id, game]) => {
            const searchTerm = query.toLowerCase();
            const gameTitle = (t?.games?.[id]?.title || game.title).toLowerCase();
            const gameDescription = (t?.games?.[id]?.description || game.description || '').toLowerCase();
            
            return gameTitle.includes(searchTerm) || 
                   gameDescription.includes(searchTerm);
          })
          .reduce((acc, [id, game]) => {
            acc[id] = game;
            return acc;
          }, {});

        setResults(filteredGames);
      } catch (error) {
        console.error('Failed to search games:', error);
      } finally {
        setLoading(false);
      }
    }

    if (query) {
      searchGames();
    }
  }, [query, t]);

  if (loading) {
    return <div className={styles.loading}>搜索中...</div>;
  }

  return (
    <main className={styles.searchResults}>
    <LanguageSwitcher />
      <Header />
      <h1>{`搜索结果: "${query}"`}</h1>
      {Object.keys(results).length > 0 ? (
        <GameGrid t={t} games={results} />
      ) : (
        <p className={styles.noResults}>没有找到相关游戏</p>
      )}
    </main>
  );
}