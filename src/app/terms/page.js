// pages/terms.js
import styles from '@/styles/Legal.module.css';

export default function Terms() {
  return (
    <div className={styles.container}>
      <h1>Terms and Conditions</h1>
      <p>Last updated: [Date]</p>
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using Paper Minecraft, you agree to be bound by these Terms and Conditions.</p>
      <h2>2. Use of the Game</h2>
      <p>Paper Minecraft is provided for personal, non-commercial use only. You agree not to modify, distribute, or create derivative works based on the game without explicit permission.</p>
      <h2>3. Intellectual Property</h2>
      <p>All content in Paper Minecraft, including but not limited to graphics, code, and gameplay mechanics, is protected by copyright and other intellectual property laws.</p>
      <h2>4. Limitation of Liability</h2>
      <p>We are not responsible for any damages or losses resulting from your use of Paper Minecraft.</p>
      {/* Add more sections as needed */}
    </div>
  );
}