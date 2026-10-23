import { getDict, href, pageMetadata } from '@/lib/site';
import Nav from '@/components/Nav';
import IotDemo from '@/components/IotDemo';

type P = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: P) {
  const { lang } = await params;
  return pageMetadata(lang, 'iot/demo', getDict(lang).demo.meta);
}

export default async function Demo({ params }: P) {
  const { lang } = await params;
  const t = getDict(lang);
  return (
    <>
      <Nav lang={lang} page="iot/demo" t={t} />
      <main className="demo-page">
        <div className="container">
          <a className="demo-back" href={href(lang, 'iot')}>{t.demo.back}</a>
          <IotDemo t={t.demo} />
          <div className="panel demo-cta" style={{ marginTop: '1rem' }}>
            <div>
              <h2>{t.demo.cta}</h2>
              <p>{t.demo.ctaText}</p>
            </div>
            <a className="btn" href={`${href(lang, 'iot')}#contacto`}>{t.common.talk}</a>
          </div>
        </div>
      </main>
    </>
  );
}
