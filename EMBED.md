# Usar las láminas desde otro proyecto

Las imágenes viven en GitHub Pages. Tu otro proyecto solo referencia los links.

**Base:** `https://USUARIO.github.io/REPO/`  (se completa al desplegar)

## Imagen directa
```html
<img src="https://USUARIO.github.io/REPO/RE_ST_PAULI.jpeg" alt="St Pauli">
```
`<img>` cross-origin no necesita nada extra.

## Manifest (todas las láminas + metadata)
`cards.json` tiene: categorías (nombre, color, ícono, descripción) y cada lámina (`categoria`, `nombre`, `file`, `url`).

GitHub Pages manda `access-control-allow-origin: *`, así que `fetch` cross-origin funciona:

```js
const { laminas, categorias } = await fetch(
  "https://USUARIO.github.io/REPO/cards.json"
).then(r => r.json());

for (const l of laminas) {
  const img = new Image();
  img.src = l.url;        // link a la imagen en TU Pages
  img.alt = l.nombre;
  document.body.append(img);
}
```

Filtrar por categoría:
```js
const rebeldes = laminas.filter(l => l.categoria === "RE");
```

## Agregar láminas nuevas
1. Dejá el `.jpeg` con prefijo de categoría (RE, ME, CA, BA, FO, HA, OB, CU) en la carpeta.
2. `python3 gen-cards.py https://USUARIO.github.io/REPO/`
3. Commit + push. Pages se actualiza solo.
