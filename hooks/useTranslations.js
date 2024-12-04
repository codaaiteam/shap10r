// hooks/useTranslations.js
'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getTranslation } from '@/lib/cloudflare';

export function useTranslations() {
  const params = useParams();
  const [currentLocale, setCurrentLocale] = useState('en');
  const [t, setT] = useState(null);

  useEffect(() => {
    async function loadTranslations() {
      const locale = params?.lang || 'en';
      setCurrentLocale(locale);
      const translations = await getTranslation(locale);
      setT(translations);
    }
    loadTranslations();
  }, [params]);

  return { t, currentLocale };
}