'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/hooks/useTranslations';

const StarIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? "#5B4FDB" : "none"} // 改为主题蓝色
    stroke={filled ? "#5B4FDB" : "rgba(91, 79, 219, 0.3)"} // 未选中时使用淡化的主题色
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ 
      marginRight: '4px', 
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      transform: 'scale(1)',
      '&:hover': {
        transform: 'scale(1.1)'
      }
    }}
  >
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const SimpleRating = () => {
  const pathname = usePathname();
  const { t, isLoading } = useTranslations();
  const [avgRating, setAvgRating] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    loadRatings();
  }, [pathname]);

  const loadRatings = () => {
    const ratings = JSON.parse(localStorage.getItem(`ratings-${pathname}`) || '[]');
    if (ratings.length > 0) {
      const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      setAvgRating(Math.round(avg * 10) / 10);
      setTotalVotes(ratings.length);
    }
  };

  const handleRating = (value) => {
    const ratings = JSON.parse(localStorage.getItem(`ratings-${pathname}`) || '[]');
    ratings.push(value);
    localStorage.setItem(`ratings-${pathname}`, JSON.stringify(ratings));
    loadRatings();
  };

  if (isLoading) return null;

  return (
    <div style={{ 
      padding: '15px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '10px',
      background: '#FFFFFF',
      borderRadius: '8px',
      border: '1px solid rgba(91, 79, 219, 0.1)',
      marginBottom: '15px',
      boxShadow: '0 2px 8px rgba(91, 79, 219, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <div 
            key={star} 
            onClick={() => handleRating(star)}
            style={{
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          >
            <StarIcon
              filled={star <= Math.round(avgRating)}
            />
          </div>
        ))}
        <span style={{ 
          marginLeft: '8px', 
          fontSize: '14px', 
          color: '#666666'  // 更新文本颜色
        }}>
          {avgRating > 0 ? 
            `${avgRating} ${t.ratingStars} (${totalVotes} ${t.totalVotes})` : 
            t.clickToRate}
        </span>
      </div>
    </div>
  );
};

export default SimpleRating;