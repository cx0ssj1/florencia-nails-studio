"""Recorta y optimiza las fotos originales de /imagenes hacia /assets/img (WebP).

Uso:  python scripts/build-images.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "imagenes"
OUT = ROOT / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

# (archivo origen, caja de recorte (izq, arriba, der, abajo) o None, nombre destino, ancho máx)
JOBS = [
    ("logo.png", (150, 90, 1500, 1420), "logo-florencia", 1100),
    ("ejemplos-reales-poligel.png", (8, 0, 940, 505), "poligel-french-glitter", 1000),
    ("ejemplos-reales-poligel.png", (8, 512, 940, 1056), "poligel-rojo-almendra", 1000),
    ("ejemplos-reales-poligel.png", (8, 1064, 940, 1552), "poligel-cat-eye-blanco", 1000),
    ("referencias-reales.png", (0, 0, 934, 650), "french-lunares-flor", 1000),
    ("referencias-reales.png", (0, 890, 934, 1518), "french-lunares-rosa", 1000),
    ("Captura de pantalla 2026-11-02 131326.png", (322, 840, 552, 1060), "pedicure-magenta", 600),
    ("Captura de pantalla 2026-11-02 131326.png", (95, 85, 315, 305), "permanente-nude-dorado", 600),
    ("colores-disponibles.png", (0, 110, 1380, 1546), "carta-colores", 1200),
    ("esmaltado-permanente-manicure-y-pedicure.png", None, "esmaltado-permanente", 900),
]

for src, box, name, max_w in JOBS:
    im = Image.open(SRC / src).convert("RGB")
    if box:
        im = im.crop(box)
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    dest = OUT / f"{name}.webp"
    im.save(dest, "WEBP", quality=82, method=6)
    print(f"{dest.name}: {im.size}, {dest.stat().st_size // 1024} KB")

# Favicon / imagen social a partir del logo
logo = Image.open(SRC / "logo.png").convert("RGB").crop((150, 90, 1500, 1420))
logo.resize((512, 512), Image.LANCZOS).save(OUT / "og-florencia.jpg", "JPEG", quality=85)
logo.resize((180, 180), Image.LANCZOS).save(OUT / "apple-touch-icon.png")
logo.resize((64, 64), Image.LANCZOS).save(OUT / "favicon.png")
print("favicons listos")
