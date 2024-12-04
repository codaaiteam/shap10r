// src/app/Components/Analytics.js
import Script from 'next/script';

export default function Analytics() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-1NVXP8SB8Z"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'gp8OOTgtImSxvl5BNocZiHeMKwXw5QP6e7SaeCVQjEQ');
        `}
      </Script>
    </>
  );
}