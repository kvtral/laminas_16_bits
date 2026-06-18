# Usar las láminas desde otro proyecto

Las imágenes viven en GitHub Pages (carpeta `images/`). Tu otro proyecto solo referencia los links.

**Base:** `https://kvtral.github.io/laminas_16_bits/`

## Imagen directa
```html
<img src="https://kvtral.github.io/laminas_16_bits/images/RE_ST_PAULI.jpeg" alt="St Pauli">
```
`<img>` cross-origin no necesita nada extra.

## Manifest (todas las láminas + metadata)
`cards.json` tiene: categorías (nombre, color, ícono, descripción) y cada lámina (`categoria`, `nombre`, `file`, `url`).
El `url` ya viene absoluto y apunta a `images/`.

GitHub Pages manda `access-control-allow-origin: *`, así que `fetch` cross-origin funciona:

```js
const { laminas, categorias } = await fetch(
  "https://kvtral.github.io/laminas_16_bits/cards.json"
).then(r => r.json());

for (const l of laminas) {
  const img = new Image();
  img.src = l.url;        // link absoluto a la imagen en TU Pages
  img.alt = l.nombre;
  document.body.append(img);
}
```

Filtrar por categoría:
```js
const rebeldes = laminas.filter(l => l.categoria === "RE");
```

## Agregar láminas nuevas (automático vía CI)
1. Dejá el `.jpeg` con prefijo de categoría (RE, ME, CA, BA, FO, HA, OB, CU) en `images/`.
2. `git add images/ && git commit -m "nueva lámina" && git push`
3. La GitHub Action regenera `cards.json` y redeploya Pages sola. Listo.

(Local, sin push: `python3 gen-cards.py https://kvtral.github.io/laminas_16_bits/`)
