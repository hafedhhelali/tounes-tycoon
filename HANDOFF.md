# HANDOFF - Tounes Tycoon
MAJ: 2026-11-06 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v140)
1. Header ultra-compact 1 ligne & Bulle Carte 3D (`index.html`, `store_animator.js`) : `<header>` épuré sur une seule ligne (~38px, zéro scroll), et réintégration de l'orbe 3D haute visibilité dans le ciel du canvas (`hud_map`) avec double anneau doré pulsant et ruban `خريطة تونس 🇹🇳`.
2. Carte élargie Grand Maghreb & Afrique du Nord (`store_animator.js`) : dimension étendue à 1040x760 avec pan 2D fluide (X/Y) et inertie pour parcourir l'Afrique du Nord, avec silhouettes vectorielles détaillées et badges nationaux pour le Maroc 🇲🇦, la Mauritanie 🇲🇷, l'Algérie 🇩🇿, la Libye 🇱🇾, l'Égypte 🇪🇬 et la Tunisie 🇹🇳.
3. Toutes les 6 capitales régionales interactives (`store_animator.js`) : Rabat 🇲🇦, Alger 🇩🇿, Tunis 🇹🇳, Tripoli 🇱🇾, Le Caire 🇪🇬, Nouakchott 🇲🇷 avec nœuds dorés `🏛️⭐`, autoroutes transmaghrébines connectées, caravanes animées et modales de bonus commerciaux internationaux.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés : `store_animator.js`, `index.html`, `HANDOFF.md`, `CHANGELOG.md`.
- Suite de tests : 70/70 au vert (`npm test`).
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
