# HANDOFF - Tounes Tycoon
MAJ: 2026-11-08 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v151)
1. Résolution root-cause du crash chargement : inclusion autonome de `PixiGpuEngine` dans `store_animator.js` et ajout de `*.js` dans le workflow APK (`build-apk.yml`), éliminant l'erreur 404 de module WebView qui bloquait tout le JS.
2. Rétablissement navigation & démarrage : réactivation de la barre de navigation segmentée visible (`tabBtnBusinesses`, `tabBtnZones`, `tabBtnTactics`) et appel explicite de `switchTab('businesses')` avec redimensionnement immédiat des canvas au boot.
3. Carte Tunisie & Maghreb ultra-réaliste : correction des coordonnées côtières (Gabès, Annaba, Tripoli), suppression des routes traversant la mer, ajout de la Sicile, Pantelleria, Lampedusa, rose des vents dorée et fond marin étendu sans bordure vide.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés : `index.html`, `store_animator.js`, `motion_engine.js`, `.github/workflows/build-apk.yml`, `scripts/ship.ps1`, `scripts/test_index_html.mjs`, `HANDOFF.md`.
- Suite de tests : 76/76 au vert (`npm test`), validation VM sandbox `scripts/test_index_html.mjs` OK.
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
