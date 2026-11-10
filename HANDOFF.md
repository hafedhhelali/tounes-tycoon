# HANDOFF - Tounes Tycoon
MAJ: 2026-11-10 - etat = HEAD de main (voir git log -n1)

## État en 3 lignes (v155)
1. **Banque guichets visibles** : le bâtiment de rue `drawBankBranch` affiche maintenant 2 guichets vitrés (الشباك 1/2) avec banquier derrière la vitre, micro hygiaphone, lueur néon pulsée, plateau passe-documents laiton, file d'attente animée devant le DAB.
2. **Sons améliorés** : réverbération procédurale (impulse 0.85s) + bus SFX sec/humide (`playBankVault` nouveau : clac cadenas + grincement rouleau + carillon marbre). Routage 42 call sites → `sfxTarget` ; son câblé à l'ouverture/fermeture modale banque + dépôts + retraits. `audio.test.js` (2 tests).
3. **Guichet tabac amélioré** : vitre blindée hygiaphone avec reflet animé bordeaux/or, plateau passe-documents avec timbre fiscal vibreur (🎟️), file d'attente de 2 clients bobbing devant le comptoir — la garde `250`.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
1. **Couche Pixar GPU activée** : `pixi.min.js` chargé dans `index.html` → `window.PIXI` branché, `PixiGpuEngine.isSupported = true` sous WebGL (fallback Canvas 2D intact en headless). C'était la lib avancée déjà en dépôt — jamais branchée.
2. **FX éclairage étendus** à 3 nouveaux archétypes (canonique `pixi_renderer.js` ET doublon `store_animator.js` synchronisés) : `kahwa` braise chicha pulsante, `studio_jeux_video` grille néon RGB coder + halo cyan/violet, `hotel`/`centre_thalasso` halo aquatique. Pipeline unique rAF dt-driven, 0 fuite mémoire (`cancelAnimationFrame` + `destroy()`).
3. **SDK pub externe retiré** : script AdSense `adsbygoogle` supprimé du `<head>` (zéro requête réseau publicitaire). Funnel AdMob reste derrière `AdPolicy.ADS_ENABLED`.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
1. **Zéro publicité** : kill-switch `AdPolicy.ADS_ENABLED = false` dans `ads_service.js`. `showRewardedBoost()` retourne `true` immédiatement (récompense accordée sans aucun affichage) → AdMob natif ET lecteur intégré neutralisés. Tous les boutons "watched ?" du jeu fonctionnent normalement.
2. Architecture pubs prête : flip `ADS_ENABLED = true` réactive le funnel complet (1. pont natif Capacitor AdMob → 2. lecteur intégré 3s). Aucune autre modification requise, interface unique `showRewardedBoost(contextLabel)` respectée par ~12 call sites dans `index.html`.
3. Tests : `ads_service.test.js` (2 tests — kill-switch + cohérence politiques boost). Suite 116/116 au vert, sandbox `test_index_html.mjs` OK.

## Contexte pour reprise immédiate (Nouvelle fenêtre / Agent suivant)
- Historique v152 : commerce `studio_jeux_video` (recrutement équipe UI/UX 180K + expert tycoon 600K) à Tunis/Sousse; événements gaming `gamers_sousse` (studio x3) et `hackathon_monitoring` (studio x2.5); graphisme studio (template indigo, néon RGB `coderGlow`).
- Historique v154 : couche Pixi GPU activée (`pixi.min.js` → `window.PIXI`), +3 FX archétypes (kahwa/studio/hotel), SDK AdSense externe retiré.
- Historique v153 : kill-switch `AdPolicy.ADS_ENABLED = false` (zéro pub affichée, récompenses libres), funnel AdMob prêt au flip.
- Dépôt : `c:\Projects\tounes-tycoon` (branche `main`, synchronisée avec `origin/main` et `www/`).
- Fichiers modifiés (v155) : `store_animator.js` (guichets banque rue + hygiaphone tabac), `audio.js` (réverb + bus SFX + `playBankVault`), `audio.test.js` (nouveau), `index.html` (câblage son banque).
- Suite de tests : 125/125 au vert (`npm test`), validation VM sandbox `scripts/test_index_html.mjs` OK.
- Outil de livraison obligatoire : `scripts/ship.ps1 "<type>(<scope>): <msg>"`.
- Copyright : `© EOLabs 2026`.
