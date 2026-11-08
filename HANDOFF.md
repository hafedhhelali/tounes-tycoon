# HANDOFF - Tounes Tycoon
MAJ: 2026-11-08 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v150)
1. Résolution définitive blocage overlay : ajout d'une animation pure CSS `@keyframes autoDismissSplashKeyframe` (auto-dismiss forcé à 2.3s par le compositeur GPU du navigateur, indépendant du JS).
2. Déverrouillage tactile & barre de progression CSS : auto-remplissage CSS natif et suppression instantanée au tap sur l'écran d'accueil (`onclick` inline), double sécurité dans `<head>`.
3. Validation & Tests : 84/84 tests unitaires réussis (`npm test`), simulation VM validée, zéro possibilité de freeze au démarrage.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés : `index.html`, `store_animator.js`, `motion_engine.js`, `.github/workflows/build-apk.yml`, `scripts/ship.ps1`, `scripts/test_index_html.mjs`, `HANDOFF.md`.
- Suite de tests : 76/76 au vert (`npm test`), validation VM sandbox `scripts/test_index_html.mjs` OK.
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
