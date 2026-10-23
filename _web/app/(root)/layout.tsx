export const metadata = {
  title: 'White Suit Studio',
  description: 'Estudio boutique de desarrollo de software y robótica. Producimos apps digitales y videojuegos. Desde Buenos Aires.',
  icons: { icon: '/img/favicon.png' },
};

export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'Raleway, system-ui, sans-serif', fontWeight: 300, textAlign: 'center', padding: '20vh 16px', color: '#1f1f1f' }}>
        {children}
      </body>
    </html>
  );
}
