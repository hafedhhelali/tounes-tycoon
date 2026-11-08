# HANDOFF - Tounes Tycoon
MAJ: 2026-11-08 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v144)
1. Moteur micro-motion 60 FPS mobile (`motion_engine.js`) : pool WAAPI GPU sans GC stutter, physique de ressorts semi-implicite, squash & stretch tactile universel et interpolation exponentielle.
2. Polish graphique Canvas haute fidélité (`store_animator.js`) : clamp DPR adaptatif (<=2.5), ombres de contact radiales, pièces 3D avec projection d'épaisseur, ondes dorées interactives et éclairage atmosphérique.
3. Ergonomie mobile & tests (`index.html`, `motion_engine.test.js`) : viewport `100dvh`, respect des insets safe-area, boutons et popups spring-bounce, 76/76 tests au vert.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés : `motion_engine.js`, `motion_engine.test.js`, `store_animator.js`, `index.html`, `HANDOFF.md`, `CHANGELOG.md`.
- Suite de tests : 76/76 au vert (`npm test`).
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
