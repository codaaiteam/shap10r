// components/Header.js
'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const currentLang = params?.lang || 'en';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/${currentLang}/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href={`/${currentLang}`} className={styles.logoLink}>
          <Image
            src="/shaplor-logo.svg"
            alt="Sprunki Incredibox"
            width={150}
            height={40}
            priority
          />
        </Link>

        {/* 搜索栏 */}
        <div className={styles.searchContainer}>
          <button 
            className={styles.searchToggle}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          <form 
            className={`${styles.searchForm} ${isSearchOpen ? styles.open : ''}`}
            onSubmit={handleSearch}
          >
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="search..."
              className={styles.searchInput}
            />
          </form>
        </div>
      </div>
    </header>
  );
}