#!/usr/bin/env python3
# Genera cards.json desde los .jpeg de la carpeta. Re-correr al agregar láminas.
# Uso: python3 gen-cards.py [BASE_URL]   (ej: https://usuario.github.io/album/)
import json, glob, os, re, sys

BASE = (sys.argv[1] if len(sys.argv) > 1 else "").rstrip("/")
BASE = BASE + "/" if BASE else ""

CATS = [
    ("RE","REBELDE","#B82020","✊","Clubes ligados a la protesta, el antifascismo, la resistencia política o el rechazo al fútbol como simple negocio."),
    ("ME","MEMORIA","#2F4D7A","🕯️","Equipos marcados por tragedias, guerras, persecuciones, desapariciones o historias que merecen seguir siendo contadas."),
    ("CA","CANTERA","#2FA7D6","🌱","Clubes reconocidos por formar jugadores, desarrollar talentos y alimentar selecciones o grandes equipos."),
    ("BA","BARRIO","#2E7D4F","🏘️","Equipos cuya identidad está profundamente unida a su ciudad, comunidad, territorio y vida cotidiana."),
    ("FO","FÓSIL","#C8B56E","🦴","Clubes pioneros o muy antiguos que conservan las raíces y los primeros capítulos de la historia del fútbol."),
    ("HA","HAZAÑA","#D6A326","🏆","Equipos protagonistas de campeonatos inesperados, gestas improbables o noches en que derrotaron todos los pronósticos."),
    ("OB","OBRERO","#A65A2A","🔧","Clubes nacidos de ferroviarios, mineros, portuarios, trabajadores industriales, sindicatos u otros oficios."),
    ("CU","CULTO","#1FA6B8","🔥","Equipos con una mitología particular, personajes icónicos y una devoción que supera sus resultados deportivos."),
]

pretty = lambda f: re.sub(r"^[A-Z]{2}_", "", f).replace("_", " ").title()

laminas = []
for key, nombre, color, icono, desc in CATS:
    for path in sorted(glob.glob(f"{key}_*.jpeg")):
        file = os.path.basename(path)
        laminas.append({
            "categoria": key,
            "nombre": pretty(file[:-5]),
            "file": file,
            "url": BASE + file,   # vacío si no pasás BASE -> usar 'base' + file
        })

out = {
    "base": BASE,
    "categorias": [
        {"key": k, "nombre": n, "color": c, "icono": i, "descripcion": d}
        for k, n, c, i, d in CATS
    ],
    "laminas": laminas,
}
with open("cards.json", "w", encoding="utf-8") as fh:
    json.dump(out, fh, ensure_ascii=False, indent=2)
print(f"cards.json: {len(laminas)} láminas, base={BASE!r}")
