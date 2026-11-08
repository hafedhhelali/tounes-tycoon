# HANDOFF - Tounes Tycoon
MAJ: 2026-11-08 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v145)
1. Résolution blocage chargement démarrage : suppression de la dépendance de module externe dans `index.html` en exportant directement les primitives motion depuis `store_animator.js`.
2. Synchronisation CI & build APK (`build-apk.yml`, `ship.ps1`) : ajout de `motion_engine.js` dans la préparation des assets web et copie automatique vers `android/.../public`.
3. Résilience & robustesse : garde-fous `try/catch` sur l'initialisation du pool WAAPI avec repli fluide RAF si le moteur WAAPI n'est pas supporté par la WebView.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés : `index.html`, `store_animator.js`, `motion_engine.js`, `.github/workflows/build-apk.yml`, `scripts/ship.ps1`, `scripts/test_index_html.mjs`, `HANDOFF.md`.
- Suite de tests : 76/76 au vert (`npm test`), validation VM sandbox `scripts/test_index_html.mjs` OK.
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
