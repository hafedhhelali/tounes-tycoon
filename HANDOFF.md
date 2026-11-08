# HANDOFF - Tounes Tycoon
MAJ: 2026-11-08 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v149)
1. Résolution blocage démarrage & rue projets : suppression de l'import synchrone bloquant de `pixi.min.js` dans `<head>` et ajout d'un timeout de secours garanti à 2.2s dans `initWelcomeSplashScreen`.
2. Intégration rue des projets (`QuartierAnimator`) : ajout des gabarits architecturaux pour `bar_cha3bi` et `boite_de_nuit`, fallback systématique anti-NaN, et synchronisation automatique de tous les projets de `CITY_BUSINESS_MAP` dans le tracé de la rue (`buildZoneLayout`).
3. Pipeline & Validation : 84/84 tests unitaires réussis (`npm test`), VM sandbox validée, synchronisation des assets `pixi_renderer.js` dans `scripts/ship.ps1`.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés : `index.html`, `store_animator.js`, `motion_engine.js`, `.github/workflows/build-apk.yml`, `scripts/ship.ps1`, `scripts/test_index_html.mjs`, `HANDOFF.md`.
- Suite de tests : 76/76 au vert (`npm test`), validation VM sandbox `scripts/test_index_html.mjs` OK.
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
