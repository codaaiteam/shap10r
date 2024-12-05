// src/app/Components/Analytics.js
import Script from 'next/script';

export default function Analytics() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-LQ3Y7K64BY"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'ejTNzps4rUJKSZrNs1b57sjcCQU5MdlsNxUCvhIgJuU');
        `}
      </Script>
    </>
  );
}