'use client';
import { useEffect, useRef, useState } from 'react';
import { CONTACT } from '@/lib/site';
import { track } from '@/lib/track';
import type { Dict } from '@/content/types';

/** Link al deck PDF que primero pide el email (lo guarda en la misma Google Sheet). */
export default function DeckButton({ label, t, lang }: { label: string; t: Dict['mvp']['modal']; lang: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    try {
      const saved = localStorage.getItem('deckEmail');
      if (saved && emailRef.current) emailRef.current.value = saved;
    } catch {}
    setTimeout(() => emailRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') || '').trim();
    const name = String(fd.get('name') || '').trim();
    if (!email) return;
    setBusy(true);
    setError(false);
    try { localStorage.setItem('deckEmail', email); } catch {}
    track('generate_lead', { event_category: 'download', event_label: `descarga_pdf_modal-${lang}` });
    // Abro el PDF antes del fetch para no perder el gesto del usuario (bloqueo de pop-ups)
    const win = window.open(CONTACT.deckPdf, '_blank');
    try {
      await fetch(CONTACT.formEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'download', name, email, message: 'Descarga PDF', timestamp: new Date().toISOString(), source: `mvp-${lang} · ${location.href}` }),
      });
      setOpen(false);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
      if (!win) location.href = CONTACT.deckPdf;
    }
  }

  return (
    <>
      <a
        className="link"
        href={CONTACT.deckPdf}
        onClick={(e) => {
          e.preventDefault();
          track('click_descargar_deck', { lang });
          setOpen(true);
        }}
      >
        {label}
      </a>
      {open && (
        <div className="modal">
          <div className="overlay" onClick={() => setOpen(false)} />
          <div className="box" role="dialog" aria-modal="true" aria-labelledby="deck-title">
            <button type="button" className="close" aria-label={t.close} onClick={() => setOpen(false)}>×</button>
            <h3 id="deck-title">{t.title}</h3>
            <p>{t.text}</p>
            <form className="form" onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="deck-email">{t.email}</label>
                <input ref={emailRef} id="deck-email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="field">
                <label htmlFor="deck-name">{t.name} <span className="small">{t.optional}</span></label>
                <input id="deck-name" name="name" type="text" autoComplete="name" />
              </div>
              <button className="btn" type="submit" disabled={busy}>{busy ? t.opening : t.submit}</button>
              {error && <p className="form-msg error">{t.error}</p>}
              <p className="small">{t.privacy}</p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
