# HANDOFF - Tounes Tycoon
MAJ: 2026-11-08 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v148)
1. Intégration PixiJS v8 2D HD GPU : bundle local autonome `pixi.min.js` (840 KB, 100% offline sans CDN) et moteur de rendu `pixi_renderer.js`.
2. Graphismes & Textures HD : atlas vectoriel haute résolution remplaçant les emojis système (chope Celtia dorée et mousseuse, cocktails néons, bambalouni caramélisé au sucre, fricassé tunisien) et éclairage temps réel (3 lasers animés en boîte de nuit, spots de boule à facettes, halo néon chaud au bar cha3bi).
3. Robustesse & Tests : 84/84 tests unitaires au vert (`npm test`), zéro fuite mémoire, simulation VM de chargement passée avec succès.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés : `index.html`, `store_animator.js`, `motion_engine.js`, `.github/workflows/build-apk.yml`, `scripts/ship.ps1`, `scripts/test_index_html.mjs`, `HANDOFF.md`.
- Suite de tests : 76/76 au vert (`npm test`), validation VM sandbox `scripts/test_index_html.mjs` OK.
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
