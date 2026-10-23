import Script from 'next/script';
import { TRACKING } from '@/lib/site';

/** GA4 + Google Ads + Meta Pixel + LinkedIn Insight (los mismos IDs que usaba cto.whitesuit.studio). */
export default function Analytics() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${TRACKING.ga4}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${TRACKING.ga4}');
        gtag('config', '${TRACKING.googleAds}', { 'allow_enhanced_conversions': true });
      `}</Script>
      <Script id="meta-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${TRACKING.metaPixel}');
        fbq('track', 'PageView');
      `}</Script>
      <Script id="linkedin-insight" strategy="afterInteractive">{`
        _linkedin_partner_id = "${TRACKING.linkedinPartner}";
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
        window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        (function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}
        var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");
        b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";
        s.parentNode.insertBefore(b,s);})(window.lintrk);
      `}</Script>
    </>
  );
}
