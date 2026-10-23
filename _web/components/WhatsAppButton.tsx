'use client';
import { CONTACT } from '@/lib/site';
import { track } from '@/lib/track';

/** Botón flotante de WhatsApp (abajo a la derecha). El número no se muestra en la página. */
export default function WhatsAppButton({ label, message, lang }: { label: string; message: string; lang: string }) {
  const href = `${CONTACT.whatsappHref}?text=${encodeURIComponent(message)}`;
  return (
    <a
      className="wa-float"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      onClick={() => track('click_whatsapp', { lang, page: location.pathname })}
    >
      <svg viewBox="0 0 32 32" style={{ width: "1.75rem", height: "1.75rem" }} aria-hidden="true">
        <path
          fill="currentColor"
          d="M16 3C8.82 3 3 8.68 3 15.68c0 2.45.72 4.73 1.96 6.67L3.2 28.6l6.5-1.7a13.2 13.2 0 0 0 6.3 1.58c7.18 0 13-5.68 13-12.68S23.18 3 16 3Zm0 23.2c-2.06 0-3.98-.58-5.6-1.6l-.4-.24-3.86 1 1.03-3.7-.27-.4a10.3 10.3 0 0 1-1.7-5.58c0-5.72 4.78-10.37 10.8-10.37s10.8 4.65 10.8 10.37S22.02 26.2 16 26.2Zm5.93-7.77c-.32-.16-1.92-.93-2.22-1.04-.3-.1-.51-.16-.73.16-.21.31-.84 1.03-1.03 1.24-.19.21-.38.23-.7.08-.33-.16-1.37-.5-2.6-1.57-.97-.84-1.62-1.88-1.81-2.2-.19-.3-.02-.48.14-.63.15-.14.33-.37.49-.55.16-.19.21-.32.32-.53.1-.21.05-.4-.03-.55-.08-.16-.73-1.73-1-2.36-.26-.62-.53-.54-.73-.55h-.62c-.21 0-.56.08-.86.39-.29.31-1.13 1.08-1.13 2.64 0 1.55 1.16 3.06 1.32 3.27.16.2 2.28 3.4 5.52 4.77.77.33 1.37.52 1.84.67.77.24 1.48.2 2.03.12.62-.09 1.92-.77 2.19-1.5.27-.75.27-1.38.19-1.51-.08-.14-.3-.22-.62-.37Z"
        />
      </svg>
    </a>
  );
}
