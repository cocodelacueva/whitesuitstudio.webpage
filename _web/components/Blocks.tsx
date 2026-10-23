import Rich from './Rich';
import ContactForm from './ContactForm';
import { CONTACT, href } from '@/lib/site';
import type { Dict, Item, Stat, Step, Work } from '@/content/types';

export function PageHero({ kicker, title, lead, children }: { kicker: string; title: string; lead: string; children?: React.ReactNode }) {
  return (
    <section className="page-hero">
      <div className="container">
        <span className="kicker">{kicker}</span>
        <h1 className="h-page"><Rich text={title} /></h1>
        <p className="lead"><Rich text={lead} /></p>
        {children}
      </div>
    </section>
  );
}

export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <div className="stats">
      {stats.map((s) => (
        <div className="stat" key={s.label}>
          <div className="v">{s.value}</div>
          <div className="l">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export function Items({ items, cols = 3, numbered = false }: { items: Item[]; cols?: 2 | 3 | 4; numbered?: boolean }) {
  return (
    <div className={`grid grid-${cols}`}>
      {items.map((it, i) => (
        <div className="item" key={it.title}>
          {numbered && <span className="num">{String(i + 1).padStart(2, '0')}</span>}
          <h3>{it.title}</h3>
          <p><Rich text={it.text} /></p>
        </div>
      ))}
    </div>
  );
}

export function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="steps">
      {steps.map((s) => (
        <li className="step" key={s.title}>
          <span className="when">{s.when}</span>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

function WorkRow({ w }: { w: Work }) {
  const external = w.link && /^https?:/.test(w.link.href);
  return (
    <li className="work">
      <div>
        <h3>{w.title}</h3>
        <span className="tag">{w.tag}</span>
      </div>
      <p>{w.text}</p>
      <div className="aside">
        {w.status && <span className="status">{w.status}</span>}
        {w.link && (
          <a className="link" href={w.link.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {w.link.label}
          </a>
        )}
      </div>
    </li>
  );
}

export function Works({ t, labels }: { t: Dict['works']; labels: { clients: string; own: string } }) {
  return (
    <section className="section" id="trabajos">
      <div className="container">
        <span className="kicker">{t.kicker}</span>
        <h2 className="h-section">{t.title}</h2>
        <div className="works-group">
          <h3 className="label">{labels.clients}</h3>
          <ul className="works">{t.clients.map((w) => <WorkRow key={w.title} w={w} />)}</ul>
        </div>
        <div className="works-group">
          <h3 className="label">{labels.own}</h3>
          <ul className="works">{t.own.map((w) => <WorkRow key={w.title} w={w} />)}</ul>
        </div>
        <p className="works-note">{t.note}</p>
      </div>
    </section>
  );
}

export function About({ t, soft = false }: { t: Dict['about']; soft?: boolean }) {
  return (
    <section className={`section${soft ? ' soft' : ''}`} id="quien">
      <div className="container about">
        <img src="/img/perfil.jpeg" alt="Coco, White Suit Studio" width={400} height={400} loading="lazy" />
        <div className="copy">
          <span className="kicker">{t.kicker}</span>
          <h2 className="h-section">{t.title}</h2>
          {t.paragraphs.map((p, i) => <p key={i}><Rich text={p} /></p>)}
          <a className="link" href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">{t.linkedin}</a>
          <Stats stats={t.stats} />
        </div>
      </div>
    </section>
  );
}

export function CrossLink({ note, label, to }: { note: string; label: string; to: string }) {
  return (
    <div className="crosslink">
      <p>{note}</p>
      <a className="link" href={to}>{label}</a>
    </div>
  );
}

export function Contact({ t, source, lang }: { t: Dict; source: string; lang: string }) {
  const c = t.contact;
  return (
    <section className="section soft" id="contacto">
      <div className="container contact">
        <div className="side">
          <span className="kicker">{t.nav.contact}</span>
          <h2 className="h-section">{c.title}</h2>
          <p>{c.text}</p>
          <ul className="channels">
            <li><span>{c.calendarLabel}</span><a href={CONTACT.calendar} target="_blank" rel="noopener noreferrer">{c.schedule}</a></li>
          </ul>
        </div>
        <ContactForm t={c} source={`${source}-${lang}`} />
      </div>
    </section>
  );
}

export { href };
