import { CONTACT } from '@/lib/site';
import type { Dict } from '@/content/types';

export default function Footer({ t }: { t: Dict }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© 2025 White Suit Studio · {t.footer.city}. {t.footer.rights}</p>
        <ul>
          <li><a href={CONTACT.linkedinCompany} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href={CONTACT.youtube} target="_blank" rel="noopener noreferrer">YouTube</a></li>
          <li><a href={CONTACT.cookiesPolicy}>Cookies</a></li>
        </ul>
      </div>
    </footer>
  );
}
