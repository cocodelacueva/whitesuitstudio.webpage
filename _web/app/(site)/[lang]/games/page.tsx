import { getDict, pageMetadata } from '@/lib/site';
import Nav from '@/components/Nav';

type P = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: P) {
  const { lang } = await params;
  return pageMetadata(lang, 'games', getDict(lang).games.meta);
}

const ext = (h: string) => (/^https?:/.test(h) ? { target: '_blank', rel: 'noopener noreferrer' } : {});

export default async function Games({ params }: P) {
  const { lang } = await params;
  const t = getDict(lang);
  const g = t.games;
  return (
    <>
      <Nav lang={lang} page="games" t={t} />
      <main>
        {/* Igual que la home original de whitesuit.studio */}
        <section className="home-hero">
          <picture>
            <source media="(min-width: 1200px)" srcSet="/img/white-suit-1200.jpeg 1x, /img/white-suit-1920.jpeg 2x" />
            <source media="(min-width: 100px)" srcSet="/img/white-suit-769.jpeg 1x, /img/white-suit-1200.jpeg 2x" />
            <img className="main-image" src="/img/white-suit-1200.jpeg" alt="White Suit Studio" width={1200} height={932} />
          </picture>
          <h1><strong>white suit</strong> studio</h1>
          <p>{g.lead}</p>
          <a className="scroll-cue" href="#juegos">{g.kicker} ↓</a>
        </section>

        <section className="section" id="juegos">
          <div className="container">
            <span className="kicker">{g.kicker}</span>
            <h2 className="h-section">{g.title}</h2>
            <div className="games">
              {g.list.map((game) => (
                <article className="game" key={game.title}>
                  <a className="cover" href={game.links[0].href} {...ext(game.links[0].href)} aria-label={game.title}>
                    {game.image ? (
                      <img src={game.image} alt={game.title} width={900} height={900} loading="lazy" />
                    ) : (
                      <span className="placeholder">{game.title}</span>
                    )}
                  </a>
                  <div className="meta"><span>{game.platform}</span><span>{game.status}</span></div>
                  <h3>{game.title}</h3>
                  <p>{game.text}</p>
                  <div className="glinks">
                    {game.links.map((l) => (
                      <a key={l.href} className="link" href={l.href} {...ext(l.href)}>{l.label}</a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
