# HANDOFF - Tounes Tycoon
MAJ: 2026-11-08 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v146)
1. Carte de Tunisie & Maghreb réaliste : tracé vectoriel anatomique haute précision (60 points de côte, golfes, îles, chotts) et réalignement géographique exact de toutes les villes (zéro ville dans la mer).
2. Nouveaux Projets : Bar Cha3bi تونسي (Tunis, Le Kef, Sbeitla, Gafsa) avec tables Celtia, kemia et 2 serveurs recrutables ; Boite de Nuit (Tunis, Sousse, Monastir, Nabeul) avec piste de danse, DJ booth, lasers, comptoir cocktails et 2 videurs à l'entrée filtrant les clients.
3. Moteur & Tests : 79/79 tests unitaires passés avec succès (`npm test`), zéro dérive de timer, cycle de vie et animations Canvas 60 FPS fluides.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés : `index.html`, `store_animator.js`, `motion_engine.js`, `.github/workflows/build-apk.yml`, `scripts/ship.ps1`, `scripts/test_index_html.mjs`, `HANDOFF.md`.
- Suite de tests : 76/76 au vert (`npm test`), validation VM sandbox `scripts/test_index_html.mjs` OK.
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
