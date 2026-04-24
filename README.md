# Groene Stroom PWA — Installatie-instructies

## Wat is dit?
Een Progressive Web App (PWA) die live CO₂-intensiteit en zonnepaneel-prognoses
toont voor Amsterdam, op basis van NED.nl (TenneT/Gasunie) data.

## Benodigde bestanden
Upload alle bestanden naar een webserver (map-structuur bewaren):
```
index.html          ← hoofdpagina
manifest.json       ← PWA configuratie
sw.js               ← service worker (offline support)
icons/
  icon-96.png
  icon-152.png
  icon-167.png
  icon-180.png
  icon-192.png
  icon-512.png
```

## Hostingopties (gratis)

### Optie A: GitHub Pages (aanbevolen)
1. Maak een gratis account op github.com
2. Nieuw repository → upload alle bestanden
3. Settings → Pages → Branch: main → Save
4. URL wordt: https://jouwgebruikersnaam.github.io/groene-stroom/

### Optie B: Netlify (drag & drop)
1. Ga naar netlify.com → gratis account
2. Sleep de hele map naar het Netlify-dashboard
3. Klaar — je krijgt direct een HTTPS-URL

### Optie C: Eigen NAS/server
Upload via FTP naar een map op je webserver.
Vereist: HTTPS (self-signed werkt NIET voor PWA's)

## App installeren op telefoon/tablet

### Android (Chrome) — aanbevolen
1. Open de URL in Chrome
2. Tik op de ⋮ menu → "Toevoegen aan startscherm"
   OF: de app toont automatisch een installatie-banner
3. Tik "Installeer" → app staat op je startscherm

### iPad / iPhone (Safari) — vereist
(Chrome op iOS ondersteunt geen PWA-installatie)
1. Open de URL in Safari
2. Tik op het Deel-icoon (□ met pijl omhoog)
3. Scroll en tik "Zet op beginscherm"
4. Tik "Voeg toe"

## Eerste gebruik
1. Open de app
2. Tik ◎ Instellingen (rechtsonder)
3. Vul je NED.nl API-sleutel in
   (ned.nl → inloggen → Mijn account → API → Nieuwe sleutel aanmaken)
4. Stel je kWp en oriëntatie in
5. Tik "Instellingen opslaan"

## Functies
- Live CO₂-intensiteit (gCO₂/kWh) via NED.nl
- Dagprognose per uur in staafgrafiek
- Aandeel hernieuwbaar (zon + wind) per uur
- Zonnepaneel-opbrengstprognose Noord-Holland
- Beste stroomvenster aanbeveling
- Automatische refresh elke 30 minuten
- Werkt ook offline (toont laatste data)
- Nacht/donker thema (battijvriendelijk)

## Technische details
- Databronnen: NED.nl API (type 27 ElectricityMix CO₂, type 2 Solar Noord-Holland,
  type 1 Wind op land, type 51 Wind op zee) + Open-Meteo (bewolking)
- Alle API-sleutels worden alleen lokaal opgeslagen op jouw apparaat
- Geen tracking, geen analytics, geen cookies
