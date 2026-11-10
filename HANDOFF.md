# HANDOFF - Tounes Tycoon
MAJ: 2026-11-10 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v153)
1. **Zéro publicité** : kill-switch `AdPolicy.ADS_ENABLED = false` dans `ads_service.js`. `showRewardedBoost()` retourne `true` immédiatement (récompense accordée sans aucun affichage) → AdMob natif ET lecteur intégré neutralisés. Tous les boutons "watched ?" du jeu fonctionnent normalement.
2. Architecture pubs prête : flip `ADS_ENABLED = true` réactive le funnel complet (1. pont natif Capacitor AdMob → 2. lecteur intégré 3s). Aucune autre modification requise, interface unique `showRewardedBoost(contextLabel)` respectée par ~12 call sites dans `index.html`.
3. Tests : `ads_service.test.js` (2 tests — kill-switch + cohérence politiques boost). Suite 116/116 au vert, sandbox `test_index_html.mjs` OK.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
1. Nouveau commerce union `studio_jeux_video` (« ستوديو ألعاب تايكون EOLabs », 🎮) à Tunis/Sousse : recrutement d'une équipe graphistes UI/UX (آمير آرت ديركتور, 180K) + expert jeux tycoon (أنيس مطيّار تايكون, 600K) via `hireManager` générique (2 staff slots).
2. 2 nouveaux événements `TUNISIAN_EVENTS` gaming : `gamers_sousse` (studio x3, salle_de_jeux x2.2, kahwa x1.5) et `hackathon_monitoring` (studio x2.5, superette x1.8, attariya x1.6) — pipeline 100% générique, activés via `triggerRandomEvent`.
3. Graphisme studio : template immeuble `bizTemplate` (toit indigo, panneau 🎮), icônes commandes `orderIcons`, placement rues Tunis+Sousse, micro-animation CSS néon RGB `coderGlow` + particule `studioBounce` sur la carte commerce.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés (v152) : `engine.js` (+studio config, CITY_BUSINESS_MAP, TUNISIAN_EVENTS, RECIPES_MAP), `store_animator.js` (+orderIcons, bizTemplates, zoneSpecs tunis/sousse), `index.html` (CSS coderGlow/studioBounce), `engine.test.js` (+2 tests studio/événements).
- Suite de tests : 110/110 au vert (`npm test`), validation VM sandbox `scripts/test_index_html.mjs` OK.
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
