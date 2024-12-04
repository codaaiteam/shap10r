'use client'
import { usePathname, useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import styles from './LanguageSwitcher.module.css';
import { useState } from 'react';

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);

  const changeLanguage = async (newLocale) => {
    try {
      setIsChanging(true);
      const segments = pathname.split('/');
      segments[1] = newLocale;
      const newPath = segments.join('/');
      await router.push(newPath);
    } catch (error) {
      console.error('Language switch failed:', error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className={styles.languageSwitcher}>
      <select 
        onChange={(e) => changeLanguage(e.target.value)} 
        defaultValue={params?.lang || 'en'}
        className={styles.select}
        disabled={isChanging}
      >
        <option value="en">EN</option>
        <option value="ja">日本語</option>
        <option value="ko">한국어</option>
        <option value="de">DE</option>
        <option value="fr">FR</option>
        <option value="it">IT</option>
        <option value="es">ES</option>
        <option value="zh">中文</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;