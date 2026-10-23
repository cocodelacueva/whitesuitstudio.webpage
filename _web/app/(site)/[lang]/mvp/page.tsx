import { getDict, href, pageMetadata } from '@/lib/site';
import Nav from '@/components/Nav';
import DeckButton from '@/components/DeckButton';
import { About, Contact, CrossLink, Items, PageHero, Steps } from '@/components/Blocks';

type P = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: P) {
  const { lang } = await params;
  return pageMetadata(lang, 'mvp', getDict(lang).mvp.meta);
}

export default async function Mvp({ params }: P) {
  const { lang } = await params;
  const t = getDict(lang);
  const m = t.mvp;
  return (
    <>
      <Nav lang={lang} page="mvp" t={t} />
      <main>
        <PageHero kicker={m.kicker} title={m.title} lead={m.lead}>
          <div className="btns">
            <a className="btn" href="#contacto">{t.common.talk}</a>
            <DeckButton label={m.deckLink} t={m.modal} lang={lang} />
          </div>
        </PageHero>

        <section className="section soft">
          <div className="container">
            <h2 className="h-section">{m.principlesTitle}</h2>
            <Items items={m.principles} cols={3} numbered />
          </div>
        </section>

        <section className="section" id="metodo">
          <div className="container">
            <h2 className="h-section">{m.methodTitle}</h2>
            <Steps steps={m.method} />
            <div className="btns">
              <span className="muted">{m.deckText}</span>
              <DeckButton label={m.deckLink} t={m.modal} lang={lang} />
            </div>
            <CrossLink note={t.common.companyNote} label={t.common.companyLink} to={href(lang, 'software')} />
          </div>
        </section>

        <About t={t.about} soft />

        <section className="section">
          <div className="container">
            <h2 className="h-section">{m.insightsTitle}</h2>
            <ul className="insights">
              {m.insights.map((i) => (
                <li key={i.href}>
                  <a href={i.href} target="_blank" rel="noopener noreferrer">
                    <span className="tag">{i.tag}</span>
                    <h3>{i.title}</h3>
                    <span className="read">{m.readOn}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Contact t={t} source="mvp" lang={lang} />
      </main>
    </>
  );
}
