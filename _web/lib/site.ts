import es from '@/content/es';
import en from '@/content/en';
import pt from '@/content/pt';
import type { Dict } from '@/content/types';

export const SITE_URL = 'https://whitesuit.studio';
export const LOCALES = ['es', 'en', 'pt'] as const;
export type Locale = (typeof LOCALES)[number];

export const CONTACT = {
  email: 'work@whitesuit.studio',
  whatsappDisplay: '+54 9 11 6890-8250',
  whatsappHref: 'https://wa.me/5491168908250',
  calendar: 'https://calendar.app.google/xp7p8A4cpxj7DfU26',
  linkedin: 'https://www.linkedin.com/in/cocodelacueva/',
  linkedinCompany: 'https://www.linkedin.com/company/whitesuit',
  instagram: 'https://www.instagram.com/whitesuitstudioba/',
  youtube: 'https://www.youtube.com/@whitesuit.studio',
  cookiesPolicy: 'https://whitesuit.studio/cookies-policy.html',
  deckPdf: 'https://public.whitesuit.studio/wss/12-week-tailored-mvp-deck_web.pdf?utm_source=web&utm_medium=link&utm_campaign=mvp_program',
  // Apps Script del formulario (misma Google Sheet que usaba cto.whitesuit.studio)
  formEndpoint: 'https://script.google.com/macros/s/AKfycbzWEQlBYAQyWP4IXKhHSZVC47ABJVyi-_jez1elzA3TpS462O7Jm31wZ3lN4aM9pXdq/exec',
};

export const TRACKING = {
  ga4: 'G-Q6HSPWKRKY',
  googleAds: 'AW-16938222773',
  googleAdsLeadConversion: 'AW-16938222773/b5qqCOf5hK0cELWJ44w_',
  metaPixel: '1038948448867510',
  linkedinPartner: '9746337',
};

const dicts: Record<Locale, Dict> = { es, en, pt };

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

export function getDict(lang: string): Dict {
  return dicts[isLocale(lang) ? lang : 'es'];
}

export type PageKey = '' | 'software' | 'iot' | 'iot/demo' | 'mvp' | 'games';

export function href(lang: string, page: PageKey) {
  // index.html explícito: S3/CloudFront no completa el index.html de las carpetas
  return `/${lang}/${page ? page + '/' : ''}index.html`;
}

export function pageMetadata(lang: string, page: PageKey, meta: { title: string; description: string }) {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${SITE_URL}${href(l, page)}`;
  languages['x-default'] = `${SITE_URL}${href('es', page)}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `${SITE_URL}${href(lang, page)}`, languages },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}${href(lang, page)}`,
      siteName: 'White Suit Studio',
      type: 'website',
      locale: lang === 'es' ? 'es_AR' : lang === 'pt' ? 'pt_BR' : 'en_US',
      images: [{ url: '/img/white-suit-1200.jpeg', width: 1200, height: 932, alt: 'White Suit Studio' }],
    },
    icons: { icon: '/img/favicon.png', apple: '/img/favicon-512.png' },
  };
}
