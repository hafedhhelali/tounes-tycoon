# HANDOFF - Tounes Tycoon
MAJ: 2026-11-10 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v154)
1. **Couche Pixar GPU activée** : `pixi.min.js` chargé dans `index.html` → `window.PIXI` branché, `PixiGpuEngine.isSupported = true` sous WebGL (fallback Canvas 2D intact en headless). C'était la lib avancée déjà en dépôt — jamais branchée.
2. **FX éclairage étendus** à 3 nouveaux archétypes (canonique `pixi_renderer.js` ET doublon `store_animator.js` synchronisés) : `kahwa` braise chicha pulsante, `studio_jeux_video` grille néon RGB coder + halo cyan/violet, `hotel`/`centre_thalasso` halo aquatique. Pipeline unique rAF dt-driven, 0 fuite mémoire (`cancelAnimationFrame` + `destroy()`).
3. **SDK pub externe retiré** : script AdSense `adsbygoogle` supprimé du `<head>` (zéro requête réseau publicitaire). Funnel AdMob reste derrière `AdPolicy.ADS_ENABLED`.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
1. **Zéro publicité** : kill-switch `AdPolicy.ADS_ENABLED = false` dans `ads_service.js`. `showRewardedBoost()` retourne `true` immédiatement (récompense accordée sans aucun affichage) → AdMob natif ET lecteur intégré neutralisés. Tous les boutons "watched ?" du jeu fonctionnent normalement.
2. Architecture pubs prête : flip `ADS_ENABLED = true` réactive le funnel complet (1. pont natif Capacitor AdMob → 2. lecteur intégré 3s). Aucune autre modification requise, interface unique `showRewardedBoost(contextLabel)` respectée par ~12 call sites dans `index.html`.
3. Tests : `ads_service.test.js` (2 tests — kill-switch + cohérence politiques boost). Suite 116/116 au vert, sandbox `test_index_html.mjs` OK.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Historique v152 : commerce `studio_jeux_video` (recrutement équipe UI/UX 180K + expert tycoon 600K) à Tunis/Sousse; événements gaming `gamers_sousse` (studio x3) et `hackathon_monitoring` (studio x2.5); graphisme studio (template indigo, néon RGB `coderGlow`).
- Historique v153 : kill-switch `AdPolicy.ADS_ENABLED = false` (zéro pub affichée, récompenses libres), funnel AdMob prêt au flip.
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés (v154) : `index.html` (+script pixi.min.js, −AdSense), `pixi_renderer.js` + `store_animator.js` (dispatch FX +3 archétypes, doublon synchronisé), `pixi_renderer.test.js` (+tests FX).
- Suite de tests : 121/121 au vert (`npm test`), validation VM sandbox `scripts/test_index_html.mjs` OK.
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
