'use client';

import Script from 'next/script';

export function Analytics() {
  const trackingId = process.env.NEXT_PUBLIC_GTAG_TRACK_ID;
  if (!trackingId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${trackingId}', { page_path: window.location.pathname });`}
      </Script>
    </>
  );
}
