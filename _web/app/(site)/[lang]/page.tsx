import { getDict, href, pageMetadata } from '@/lib/site';
import Nav from '@/components/Nav';
import Rich from '@/components/Rich';
import { About, Contact, Works } from '@/components/Blocks';

type P = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: P) {
  const { lang } = await params;
  return pageMetadata(lang, '', getDict(lang).home.meta);
}

export default async function Home({ params }: P) {
  const { lang } = await params;
  const t = getDict(lang);
  return (
    <>
      <Nav lang={lang} page="" t={t} />
      <main>
        <section className="home-hero">
          <picture>
            <source media="(min-width: 1200px)" srcSet="/img/white-suit-1200.jpeg 1x, /img/white-suit-1920.jpeg 2x" />
            <source media="(min-width: 100px)" srcSet="/img/white-suit-769.jpeg 1x, /img/white-suit-1200.jpeg 2x" />
            <img className="main-image" src="/img/white-suit-1200.jpeg" alt="White Suit Studio" width={1200} height={932} />
          </picture>
          <h1><strong>white suit</strong> studio</h1>
          <p><Rich text={t.home.intro} /></p>
          <a className="scroll-cue" href="#que-hacemos">{t.home.scroll}</a>
        </section>

        <section className="section" id="que-hacemos">
          <div className="container">
            <span className="kicker">{t.home.doorsKicker}</span>
            <h2 className="h-section">{t.home.doorsTitle}</h2>
            <div className="doors">
              {t.home.doors.map((d) => (
                <a className="door" key={d.key} href={href(lang, d.key)}>
                  <span className="who">{d.who}</span>
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                  <span className="go"><span>→</span></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <About t={t.about} soft />
        <Works t={t.works} labels={{ clients: t.works.clientsLabel, own: t.works.ownLabel }} />
        <Contact t={t} source="home" lang={lang} />
      </main>
    </>
  );
}
