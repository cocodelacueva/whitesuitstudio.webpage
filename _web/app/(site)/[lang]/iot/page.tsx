import { getDict, href, pageMetadata } from '@/lib/site';
import Nav from '@/components/Nav';
import { Contact, Items, PageHero } from '@/components/Blocks';

type P = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: P) {
  const { lang } = await params;
  return pageMetadata(lang, 'iot', getDict(lang).iot.meta);
}

/** Vista previa estática del demo (no animada) para la página de IoT. */
function Preview({ label }: { label: string }) {
  const pts = [3.6, 3.5, 3.7, 3.6, 3.8, 3.7, 3.9, 4.1, 4.4, 4.8, 5.1, 5.5, 5.9, 6.3, 6.6, 6.8, 6.7, 6.4, 6.0, 5.5, 5.0, 4.6, 4.2, 4.0, 3.9];
  const w = 460, h = 170, l = 8, r = 8, t = 14, b = 10;
  const x = (i: number) => l + (i / (pts.length - 1)) * (w - l - r);
  const y = (v: number) => t + (1 - (v - 3) / 4.2) * (h - t - b);
  const d = pts.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
  return (
    <div className="preview" aria-hidden>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: '0.375rem' }}>
        <span>{label}</span><span className="s-crit">■ 6.8 °C</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: 'block' }}>
        {[0, 1, 2, 3].map((k) => <line key={k} x1={l} x2={w - r} y1={t + (k * (h - t - b)) / 3} y2={t + (k * (h - t - b)) / 3} className="grid-line" />)}
        <line x1={l} x2={w - r} y1={y(6)} y2={y(6)} className="thr" />
        <path d={d} className="series" />
        <circle cx={x(pts.length - 1)} cy={y(pts[pts.length - 1])} r={4.5} className="last-dot" />
      </svg>
    </div>
  );
}

export default async function Iot({ params }: P) {
  const { lang } = await params;
  const t = getDict(lang);
  const s = t.iot;
  return (
    <>
      <Nav lang={lang} page="iot" t={t} />
      <main>
        <PageHero kicker={s.kicker} title={s.title} lead={s.lead}>
          <div className="btns">
            <a className="btn" href="#contacto">{t.common.talk}</a>
          </div>
        </PageHero>

        <section className="section soft">
          <div className="container">
            <h2 className="h-section">{s.modelTitle}</h2>
            <div className="split">
              <div><h3>{s.yours.title}</h3><p>{s.yours.text}</p></div>
              <div><h3>{s.ours.title}</h3><p>{s.ours.text}</p></div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2 className="h-section">{s.whatTitle}</h2>
            <Items items={s.what} cols={2} numbered />
          </div>
        </section>

        <section className="section soft">
          <div className="container demo-teaser">
            <div>
              <span className="kicker">Demo</span>
              <h2 className="h-section" style={{ marginBottom: '1.25rem' }}>{s.demoTitle}</h2>
              <p className="lead">{s.demoText}</p>
              <div className="btns"><a className="btn" href={href(lang, 'iot/demo')}>{s.demoCta} →</a></div>
            </div>
            <a href={href(lang, 'iot/demo')} style={{ textDecoration: 'none' }}>
              <Preview label={`${t.demo.sensors[5].name} · ${t.demo.sensors[5].metric}`} />
            </a>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2 className="h-section">{s.nichesTitle}</h2>
            <Items items={s.niches} cols={4} />
          </div>
        </section>

        <Contact t={t} source="iot" lang={lang} />
      </main>
    </>
  );
}
