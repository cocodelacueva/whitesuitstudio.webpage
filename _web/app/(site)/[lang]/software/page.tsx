import { getDict, href, pageMetadata } from '@/lib/site';
import Nav from '@/components/Nav';
import { Contact, CrossLink, Items, PageHero, Steps, Works } from '@/components/Blocks';

type P = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: P) {
  const { lang } = await params;
  return pageMetadata(lang, 'software', getDict(lang).software.meta);
}

export default async function Software({ params }: P) {
  const { lang } = await params;
  const t = getDict(lang);
  const s = t.software;
  return (
    <>
      <Nav lang={lang} page="software" t={t} />
      <main>
        <PageHero kicker={s.kicker} title={s.title} lead={s.lead}>
          <div className="btns">
            <a className="btn" href="#contacto">{t.common.talk}</a>
            <a className="link" href="#proceso">{t.common.seeHow}</a>
          </div>
        </PageHero>

        <section className="section soft">
          <div className="container">
            <h2 className="h-section">{s.whyTitle}</h2>
            <Items items={s.why} cols={3} numbered />
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2 className="h-section">{s.whatTitle}</h2>
            <Items items={s.what} cols={2} />
          </div>
        </section>

        <section className="section" id="proceso">
          <div className="container">
            <h2 className="h-section" style={{ marginBottom: '0.75rem' }}>{s.processTitle}</h2>
            <p className="muted" style={{ marginBottom: '2.5rem' }}>{s.processNote}</p>
            <Steps steps={s.process} />
            <CrossLink note={t.common.founderNote} label={t.common.founderLink} to={href(lang, 'mvp')} />
          </div>
        </section>

        <Works t={t.works} labels={{ clients: t.works.clientsLabel, own: t.works.ownLabel }} />
        <Contact t={t} source="software" lang={lang} />
      </main>
    </>
  );
}
