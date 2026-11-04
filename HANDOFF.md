# HANDOFF — Tounes Tycoon
MAJ: 2026-11-04T23:58:00+01:00 - etat = HEAD de main (v123-fintech-icon-realistic-prices-lock-reasons-clean-interiors)

## État en 3 lignes (v123)
1. Icône appli/APK : logo futuriste finance (bouclier hexagonal or/cyan, barres, flèche haussière) — ZÉRO drapeau (`scripts/gen_icon.ps1`, `res/drawable*`, `mipmap-*`).
2. Prix réalistes (+1.5%/niveau) : café 1.8, cigarettes 10, yacht 100/pers, voyage 500/pers (👥1..5), viande 30/kg ; 18 villes `zoneSpecs` = `CITY_BUSINESS_MAP` ; achat via dinars+banque ; raison du verrou affichée (`🔒 مقفول • ⚠️ ناقصك X د.ت`).
3. Intérieurs épurés : HUD empilé (flex, zéro chevauchement), enseigne géante/ardoises/boutons orange supprimés, ≥1 travailleur actif dès L1 (canvas + carte `👷 عون الخدمة القار`).

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Modifs : `ads_service.js`, `engine.js`, `engine.test.js`, `store_animator.js`, `index.html`, `www/*`.
- Suite de tests : 70/70 au vert (`npm test`).
- Copyright : `© EOLabs 2026`.