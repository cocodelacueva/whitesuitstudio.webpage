'use client';
import { useEffect } from 'react';

/** Agrega la línea bajo el nav al scrollear (en la home mobile, también muestra el nombre). */
export default function NavScroll() {
  useEffect(() => {
    const nav = document.getElementById('nav');
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return null;
}
