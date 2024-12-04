'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Comments.module.css';
import SimpleRating from './SimpleRating';

const Comments = ({ title }) => {
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadCusdis = () => {
      const script = document.createElement('script');
      script.src = "https://cusdis.com/js/cusdis.es.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
        if (window.CUSDIS) {
          window.CUSDIS.initial();
        }
      };
      document.body.appendChild(script);
      
      const styleTag = document.createElement('style');
      styleTag.textContent = `
        #cusdis_thread {
          background: #ffffff;
          color: #333333 !important;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid rgba(91, 79, 219, 0.1);
          box-shadow: 0 2px 10px rgba(91, 79, 219, 0.05);
        }
        #cusdis_thread * {
          color: #333333 !important;
        }
        #cusdis_thread input,
        #cusdis_thread textarea {
          background: #f8f9fa !important;
          color: #333333 !important;
          border: 1px solid rgba(91, 79, 219, 0.2) !important;
          border-radius: 6px;
          padding: 8px 12px;
          transition: all 0.3s ease;
        }
        #cusdis_thread input:focus,
        #cusdis_thread textarea:focus {
          border-color: #5B4FDB !important;
          box-shadow: 0 0 0 2px rgba(91, 79, 219, 0.1);
          outline: none;
        }
        #cusdis_thread button {
          background: #5B4FDB !important;
          border: none !important;
          border-radius: 6px;
          color: #ffffff !important;
          padding: 8px 16px;
          transition: all 0.3s ease;
        }
        #cusdis_thread button:hover {
          background: #7165E3 !important;
          transform: translateY(-1px);
        }
        #cusdis_thread .comment-box {
          background: #f8f9fa !important;
          border: 1px solid rgba(91, 79, 219, 0.1);
          border-radius: 8px;
          padding: 15px;
          margin: 10px 0;
        }
        #cusdis_thread .comment-meta {
          color: #666666 !important;
          font-size: 0.9em;
        }
        #cusdis_thread a {
          color: #5B4FDB !important;
          text-decoration: none;
        }
        #cusdis_thread a:hover {
          text-decoration: underline;
        }
      `;
      document.head.appendChild(styleTag);
      
      return () => {
        document.body.removeChild(script);
        document.head.removeChild(styleTag);
      };
    };
    
    loadCusdis();
  }, []);

  return (
    <div className={styles.commentsWrapper}>
      <SimpleRating />
      <div 
        id="cusdis_thread"
        data-host="https://cusdis.com"
        data-app-id="4e9869d3-14ce-4c11-ae10-e13cfdff684f"
        data-page-id={pathname}
        data-page-url={`${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`}
        data-page-title={title}
        data-theme="light"
      ></div>
    </div>
  );
};

export default Comments;