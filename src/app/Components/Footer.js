// components/Footer.js
import Link from 'next/link';
import styles from './Footer.module.css'; // 更新为正确的相对路径

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Link href="/terms">Terms and Conditions</Link>
      <Link href="/privacy">Privacy Policy</Link>
      <Link href="/license">License Agreement</Link>
      
      <div className={styles.externalLinks}>
        <a href="https://c2story.com/" target="_blank" rel="noopener noreferrer">
          AI Generate Story
        </a>
        <a href="https://mochi1preview.com/" target="_blank" rel="noopener noreferrer">
          Mochi 1 Preview
        </a>
        <a href="https://www.blockblastsolvers.org" target="_blank" rel="noopener noreferrer">
          Block Blast Solver
        </a>
        <a href="https://www.miside-online.org" target="_blank" rel="noopener noreferrer">
          Miside Online Game
        </a>
        <a href="https://www.hailuoai.work" target="_blank" rel="noopener noreferrer">
          Hailuo AI Video
        </a>
      </div>
    </footer>
  );
};

export default Footer;