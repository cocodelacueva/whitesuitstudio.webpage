import { LOCALES, href, type PageKey } from '@/lib/site';
import type { Dict } from '@/content/types';
import NavScroll from './NavScroll';

function LangSwitch({ lang, page }: { lang: string; page: PageKey }) {
  return (
    <div className="lang" aria-label="Language">
      {LOCALES.map((l) => (
        <a key={l} href={href(l, page)} hrefLang={l} lang={l} aria-current={l === lang ? 'true' : undefined}>
          {l}
        </a>
      ))}
    </div>
  );
}

const LINKS: { key: 'software' | 'iot' | 'games'; label: 'software' | 'iot' | 'games' }[] = [
  { key: 'software', label: 'software' },
  { key: 'iot', label: 'iot' },
  { key: 'games', label: 'games' },
];

/** Menú: Software · IoT · Videojuegos | idiomas. En mobile los links van en una segunda línea. En Videojuegos, solo idiomas. */
export default function Nav({ lang, page, t }: { lang: string; page: PageKey; t: Dict }) {
  const current = page === 'iot/demo' ? 'iot' : page;
  return (
    <header className={`nav${page === '' || page === 'games' ? ' is-home' : ''}`} id="nav">
      <NavScroll />
      <div className="container nav-inner">
        <a className="brand" href={href(lang, '')}>
          <strong>white suit</strong><span className="studio-word"> studio</span>
        </a>
        {page !== 'games' && (
          <nav className="nav-main">
            <ul className="nav-links">
              {LINKS.map((l) => (
                <li key={l.key}>
                  <a href={href(lang, l.key)} aria-current={current === l.key ? 'page' : undefined}>{t.nav[l.label]}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {page !== 'games' && <span className="nav-sep" aria-hidden="true" />}
        <LangSwitch lang={lang} page={page} />
      </div>
    </header>
  );
}
