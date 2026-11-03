# Florencia Nails Studio: sitio web

Sitio estático (HTML + CSS + JS, sin dependencias). Abrí `index.html` en el navegador o subí la carpeta a cualquier hosting estático (Netlify, Vercel, GitHub Pages, Firebase Hosting).

## Configurar antes de publicar

1. **Número de WhatsApp**: en `main.js`, cambiá `WA_NUMBER` (formato `549` + área sin 0 + número sin 15, p. ej. `5491123456789`).
2. Opcional: agregá dirección, Instagram u horarios en el footer de `index.html`.

## Estructura

- `index.html`: contenido y secciones (Servicios, Trabajos, Colores, Cómo agendar, Preguntas).
- `styles.css`: sistema visual (paleta tomada del logo: rubor, oro y salvia; tipografías Cormorant + Jost).
- `main.js`: enlaces de WhatsApp con mensaje prearmado, selector de colores, formulario de turno y visor de fotos.
- `assets/img/`: fotos optimizadas en WebP.
- `scripts/build-images.py`: regenera `assets/img/` a partir de `imagenes/` (requiere Pillow).

Para sumar fotos nuevas: copialas a `imagenes/`, agregá una línea en `JOBS` dentro de `scripts/build-images.py`, ejecutá `python scripts/build-images.py` y sumá un `<li class="g-item">` en la galería.
