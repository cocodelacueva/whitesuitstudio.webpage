'use client';
import { useState } from 'react';
import { CONTACT } from '@/lib/site';
import { trackLead } from '@/lib/track';
import type { Dict } from '@/content/types';

export default function ContactForm({ t, source }: { t: Dict['contact']; source: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const message = String(fd.get('message') || '').trim();
    setState('sending');
    trackLead(source, email);
    try {
      await fetch(CONTACT.formEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          timestamp: new Date().toISOString(),
          source: `${source} · ${window.location.href}`,
        }),
      });
      setState('ok');
    } catch {
      setState('error');
    }
  }

  if (state === 'ok') return <p className="form-msg" role="status">{t.ok}</p>;

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="cf-name">{t.name}</label>
        <input id="cf-name" name="name" type="text" required autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="cf-email">{t.email}</label>
        <input id="cf-email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="cf-message">{t.message}</label>
        <textarea id="cf-message" name="message" rows={4} required />
      </div>
      <div>
        <button className="btn" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? t.sending : t.send}
        </button>
      </div>
      {state === 'error' && <p className="form-msg error" role="alert">{t.error}</p>}
    </form>
  );
}
