# HANDOFF - Tounes Tycoon
MAJ: 2026-11-08 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v147)
1. Correction blocage chargement : résolution d'un `else` orphelin ligne 5433 dans `store_animator.js` et gardes `typeof window !== 'undefined'` pour éviter tout freeze/SyntaxError.
2. Mémorisation permanente & test automatique : création de `index_loading.test.js` intégré dans `node --test` (82/82 tests au vert) et intégration de `scripts/test_index_html.mjs` comme garde-fou strict dans `scripts/ship.ps1`.
3. Règle AGENTS.md : directive obligatoire Zero-Blank-Screen gravée pour interdire tout commit ou push sans validation du chargement complet de l'application.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés : `index.html`, `store_animator.js`, `motion_engine.js`, `.github/workflows/build-apk.yml`, `scripts/ship.ps1`, `scripts/test_index_html.mjs`, `HANDOFF.md`.
- Suite de tests : 76/76 au vert (`npm test`), validation VM sandbox `scripts/test_index_html.mjs` OK.
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
