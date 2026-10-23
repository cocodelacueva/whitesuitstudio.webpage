import '../../globals.css';
import { LOCALES, getDict } from '@/lib/site';
import Analytics from '@/components/Analytics';
import Cookies from '@/components/Cookies';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#ffffff' };

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getDict(lang);
  return (
    <html lang={lang === 'pt' ? 'pt-BR' : lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Footer t={t} />
        <WhatsAppButton label={t.contact.whatsapp} message={t.contact.whatsappMsg} lang={lang} />
        <Cookies {...t.cookies} />
        <Analytics />
      </body>
    </html>
  );
}
