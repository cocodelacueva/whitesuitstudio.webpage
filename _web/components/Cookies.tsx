'use client';
import { useEffect, useState } from 'react';
import { CONTACT } from '@/lib/site';

export default function Cookies({ text, policy, ok }: { text: string; policy: string; ok: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem('cookiesAccepted') !== 'true') setShow(true);
    } catch {
      setShow(true);
    }
  }, []);
  if (!show) return null;
  return (
    <div className="cookies" role="region" aria-label="Cookies">
      <p>
        {text} <a href={CONTACT.cookiesPolicy}>{policy}</a>.
      </p>
      <button
        type="button"
        onClick={() => {
          try { localStorage.setItem('cookiesAccepted', 'true'); } catch {}
          setShow(false);
        }}
      >
        {ok}
      </button>
    </div>
  );
}
