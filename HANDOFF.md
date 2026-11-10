# HANDOFF - Tounes Tycoon
MAJ: 2026-11-10 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v153)
1. **Zéro publicité** : kill-switch `AdPolicy.ADS_ENABLED = false` dans `ads_service.js`. `showRewardedBoost()` retourne `true` immédiatement (récompense accordée sans aucun affichage) → AdMob natif ET lecteur intégré neutralisés. Tous les boutons "watched ?" du jeu fonctionnent normalement.
2. Architecture pubs prête : flip `ADS_ENABLED = true` réactive le funnel complet (1. pont natif Capacitor AdMob → 2. lecteur intégré 3s). Aucune autre modification requise, interface unique `showRewardedBoost(contextLabel)` respectée par ~12 call sites dans `index.html`.
3. Tests : `ads_service.test.js` (2 tests — kill-switch + cohérence politiques boost). Suite 116/116 au vert, sandbox `test_index_html.mjs` OK.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Historique v152 : commerce `studio_jeux_video` (recrutement équipe UI/UX 180K + expert tycoon 600K) à Tunis/Sousse; événements gaming `gamers_sousse` (studio x3) et `hackathon_monitoring` (studio x2.5); graphisme studio (template indigo, néon RGB `coderGlow`).
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés (v153) : `ads_service.js` (kill-switch), `ads_service.test.js` (nouveau), `HANDOFF.md`, `CHANGELOG.md`.
- Suite de tests : 116/116 au vert (`npm test`), validation VM sandbox `scripts/test_index_html.mjs` OK.
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
