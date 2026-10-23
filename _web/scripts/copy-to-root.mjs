// Copia el sitio generado (out/) a la raíz del repo, al lado de las carpetas de los juegos.
// No borra nada salvo la carpeta _next/ anterior (son los JS/CSS viejos de Next).
import { cpSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const out = resolve('out');
const root = resolve('..');
if (!existsSync(out)) {
  console.error('No existe out/. Corré primero: npm run build');
  process.exit(1);
}
const oldNext = join(root, '_next');
if (existsSync(oldNext)) rmSync(oldNext, { recursive: true, force: true });

for (const name of readdirSync(out)) {
  cpSync(join(out, name), join(root, name), { recursive: true, force: true });
  console.log('→', name);
}
console.log('\nListo. Subí la raíz del repo al bucket como siempre.');
