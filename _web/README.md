# whitesuit.studio — sitio principal (Next.js, export estático)

Código fuente de la web de White Suit Studio: home + 4 verticales (Software, IoT, MVP, Juegos) + demo IoT, en español, inglés y portugués.

No hay servidor: `next build` genera HTML/CSS/JS planos en `out/`, que se suben al S3 igual que antes.

## Uso

```bash
cd _web
npm install            # solo la primera vez
npm run dev            # http://localhost:3000/es/
npm run publish:local  # build + copia out/ a la raíz del repo
```

Después subís la raíz del repo al bucket como siempre. **Si usás `aws s3 sync`, no uses `--delete`**,
así no se borran las carpetas de los juegos.

Ejemplo:

```bash
aws s3 sync .. s3://whitesuit.studio --exclude "_web/*" --exclude ".git/*" --exclude "*.DS_Store"
# + invalidar CloudFront si corresponde
```

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Textos (ES / EN / PT) | `content/es.ts`, `content/en.ts`, `content/pt.ts` — misma estructura, `**texto**` = negrita |
| Email, WhatsApp, links, formulario, IDs de tracking | `lib/site.ts` |
| Estilos (Raleway, blanco y negro) | `app/globals.css` |
| Páginas | `app/(site)/[lang]/…` (home, software, iot, iot/demo, mvp, games) |
| Redirección por idioma en `/` | `app/(root)/page.tsx` (detecta el idioma del navegador; español por defecto) |
| Demo IoT (datos simulados) | `components/IotDemo.tsx` |
| Imágenes | `public/img/` (se publican en `/img/`) |

## Rutas generadas

```
/index.html                  → redirige a /es/index.html, /en/… o /pt/… según el navegador
/{lang}/index.html           → home
/{lang}/software/index.html
/{lang}/iot/index.html
/{lang}/iot/demo/index.html
/{lang}/mvp/index.html
/{lang}/games/index.html
```

Todos los links internos apuntan al `index.html` explícito porque el S3/CloudFront no completa
el `index.html` de las carpetas (igual que en `/pasala/index.html`). Se arma en `href()` de `lib/site.ts`.

Las carpetas `pasala/`, `chaos-craft/`, `homeless/`, `news-play/`, `public/` y las políticas `.html` de la raíz no se tocan.

## Formulario

El formulario de contacto y la descarga del deck usan el mismo Apps Script / Google Sheet que tenía cto.whitesuit.studio
(ver `../cto/google-apps-script.js`). La columna *Source* ahora dice de qué página e idioma vino el contacto (ej: `iot-es · https://…`).
