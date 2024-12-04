import styles from '@/styles/Legal.module.css';

export default function Privacy() {
  return (
    <div className={styles.container}>
      <h1>Privacy Policy</h1>
      <p>Last updated: November 13, 2024</p>

      <h2>1. Introduction</h2>
      <p>This Privacy Policy explains how Sprunki Phase 4 handles user information. As a browser-based music creation mod, we prioritize user privacy and minimize data collection.</p>

      <h2>2. Information We Collect</h2>
      <p>Sprunki Phase 4 collects minimal information necessary for gameplay:</p>
      <ul>
        <li>Browser type and version (for compatibility)</li>
        <li>Game preferences and settings</li>
        <li>Music compositions created during gameplay</li>
        <li>Basic usage statistics for game improvement</li>
      </ul>

      <h2>3. Local Storage</h2>
      <p>We use browser local storage to save:</p>
      <ul>
        <li>Your game progress</li>
        <li>Sound combinations and music creations</li>
        <li>Game settings and preferences</li>
        <li>Volume and audio settings</li>
      </ul>
      <p>This data remains on your device and is not transmitted to our servers.</p>

      <h2>4. Analytics</h2>
      <p>We use Google Analytics to understand game usage patterns:</p>
      <ul>
        <li>Number of game sessions</li>
        <li>Features most commonly used</li>
        <li>General usage patterns</li>
      </ul>
      <p>All analytics data is anonymized and does not contain personal information.</p>

      <h2>5. Third-Party Services</h2>
      <p>Sprunki Phase 4 integrates with the following services:</p>
      <ul>
        <li>Google Analytics for usage statistics</li>
        <li>Browser storage for saving progress</li>
        <li>Audio processing libraries for sound creation</li>
      </ul>
      <p>Each service operates under its own privacy policy.</p>

      <h2>6. Data Security</h2>
      <p>We protect your information through:</p>
      <ul>
        <li>Local storage encryption when applicable</li>
        <li>Secure communication protocols</li>
        <li>Regular security updates</li>
      </ul>

      <h2>7. Children&apos;s Privacy</h2>
      <p>Sprunki Phase 4 is suitable for all ages and does not knowingly collect personal information from children under 13.</p>

      <h2>8. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Clear your local game data</li>
        <li>Opt-out of analytics collection</li>
        <li>Request information about your data</li>
        <li>Clear browser storage and cookies</li>
      </ul>

      <h2>9. Updates to Privacy Policy</h2>
      <p>We may update this privacy policy to reflect:</p>
      <ul>
        <li>New features or functionality</li>
        <li>Changes in data handling practices</li>
        <li>Updates to relevant privacy laws</li>
      </ul>

      <h2>10. Contact Us</h2>
      <p>For privacy-related questions or concerns, please contact us through:</p>
      <ul>
        <li>Discord: [Your Discord Server]</li>
        <li>Github Issues: [Your Github Repository]</li>
      </ul>

      <p className={styles.note}>Note: Sprunki Phase 4 is a fan-made mod and operates independently of the original Incredibox game. For privacy concerns related to Incredibox, please contact their official support.</p>
    </div>
  );
}