// Raíz del sitio: detecta el idioma del navegador y redirige a /es/, /en/ o /pt/ (español por defecto).
const script = `(function(){
  var langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'es']);
  var target = 'es';
  for (var i = 0; i < langs.length; i++) {
    var l = String(langs[i]).toLowerCase().slice(0, 2);
    if (l === 'es' || l === 'en' || l === 'pt') { target = l; break; }
  }
  location.replace('/' + target + '/index.html' + location.search + location.hash);
})();`;

export default function RootPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <link rel="alternate" hrefLang="es" href="https://whitesuit.studio/es/index.html" />
      <link rel="alternate" hrefLang="en" href="https://whitesuit.studio/en/index.html" />
      <link rel="alternate" hrefLang="pt" href="https://whitesuit.studio/pt/index.html" />
      <link rel="alternate" hrefLang="x-default" href="https://whitesuit.studio/es/index.html" />
      <p style={{ letterSpacing: '.3em' }}><strong style={{ fontWeight: 500 }}>white suit</strong> studio</p>
      <p style={{ marginTop: 24 }}>
        <a href="/es/index.html">Español</a> · <a href="/en/index.html">English</a> · <a href="/pt/index.html">Português</a>
      </p>
    </>
  );
}
