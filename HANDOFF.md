# HANDOFF - Tounes Tycoon
MAJ: 2026-11-06 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v142)
1. Joujma Mania / Fever Mode x3 (`engine.js`, `store_animator.js`, `index.html`) : jauge d'ambiance 🌶️ جوجمة qui grimpe aux taps/récoltes, déclenchant 15s de frénésie à production x3 avec pluie de confettis, cadre néon pulsant et fanfare festive (`playJoujmaFanfare`).
2. Personnages VIP de rue interactifs (`store_animator.js`, `engine.js`, `audio.js`) : apparition du Touriste Riche 📸 (+devises), du Critique Gastronomique 🧐 (+réputation), de la Voiture de la Mariée 👰🚗 (+jackpot festif & Joujma direct) et de l'Artisan 🧰, cliquables dans la rue avec badges tactiles pulsants.
3. Progression des paliers visible & accélération manuelle continue (`index.html`) : barre de progression du prochain palier (Lv 10, 25, 50, 100...) affichée sur chaque commerce ; bouton de service qui reste actif même avec manager (`🌶️ تسريع جوجمة`) pour accélérer le cycle et chauffer la jauge.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés : `engine.js`, `engine.test.js`, `audio.js`, `store_animator.js`, `index.html`, `HANDOFF.md`, `CHANGELOG.md`.
- Suite de tests : 72/72 au vert (`npm test`).
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
